import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthModel } from 'models/auth/signIn.model';
import { UserEntity, UserRole } from 'entities/user.entity';
import { Md5 } from 'ts-md5/dist/md5';
import { UserRepository } from 'repositories/user.repository';
import { TokenAuthModel } from 'models/auth/tokenAuth.model';
import { SignUpAuthModel } from 'models/auth/signUp.model';
import { UserModel } from 'models/auth/user.model';
import { ApplicationException } from 'common/exceptions/application.exception';
import { EmailService } from './email.sevice';
import { EmailJwtStrategy } from 'common/email-jwt.strategy';
import { SignInGoogleModel } from 'models/auth/signInGoogle.model';
import { Facebook } from 'fb';
import { environment } from 'environments/environment';

function checkResponseFacebook(response, rejectObj) {
    if (response && !response.error) {
        return;
    }
    let error = !response ? 'Facebook api error.' : response.error;
    throw new ApplicationException(error);
    rejectObj();
}

@Injectable({
    scope: Scope.REQUEST
})
export class AuthService {

    constructor(private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
        private readonly emailJwtStrategy: EmailJwtStrategy) {

    }

    async signIn(model: SignInAuthModel): Promise<TokenAuthModel> {
        const user = await this.validateUser(model.email);
        if (!user || this.getHashPassowrd(model.password) != user.passwordHash) {
            throw new ApplicationException('User not found!')
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(user),
            isNewUser: false
        };
    }

    async signInByGoogle(model: SignInGoogleModel): Promise<TokenAuthModel> {
        const { OAuth2Client } = require('google-auth-library');
        let payload: any;
        try {
            const client = new OAuth2Client(model.clientId);
            const ticket = await client.verifyIdToken({
                idToken: model.accessToken,
                audience: model.clientId
            });
            payload = ticket.getPayload();
        } catch(error){
            console.log(error)
            throw new ApplicationException('Google service error')
        }
        const userid = payload['sub'] as string;

        let appUser = await this.userRepository.findOne({ googleUserId: userid });
        let isNewUser = false;
        if (!appUser) {
            isNewUser = true;
            appUser = await this.signUpGoogle({
                email: payload['email'],
                firstName: payload['given_name'],
                lastName: payload['family_name'],
            } as SignUpAuthModel, userid)
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(appUser),
            isNewUser: isNewUser
        }
    }

    private async signUpGoogle(model: SignUpAuthModel, userGoogleId: string): Promise<UserEntity> {
        await this.validateEmailForSignUp(model.email);
        let pwd = this.generateRandomPassword();
        let user = this.userRepository.create({
            email: model.email,
            firstName: model.firstName,
            lastName: model.lastName,
            emailConfirmed: true,
            googleUserId: userGoogleId,
            role: UserRole.CLIENT,
            passwordHash: this.getHashPassowrd(pwd).toString()
        });
        let sendMessage = (async () =>
            await this.emailService.sendUserPassword(model.email, 
                `${model.firstName} ${model.lastName}`, pwd));
        sendMessage();
        await this.userRepository.save(user);
        return user;
    }

    async signInFacebook(accessToken: string): Promise<TokenAuthModel> {
        console.log('token', accessToken);
        const fb = new Facebook({ version: environment.facebookData.apiVersion });
        let token = await new Promise<string>((resolve, reject) => {
            fb.api('oauth/access_token', {
                client_id: environment.facebookData.facebookClientId,
                client_secret: environment.facebookData.facebookClientSecretKey,
                grant_type: 'client_credentials'
            }, function (res) {
                checkResponseFacebook(res, reject);
                var accessToken = res.access_token;
                resolve(accessToken);
            })
        });
        console.log('acces_token', accessToken);
        let userFacebookData = await new Promise<any>((resolve, reject) => {
            fb.api(`/debug_token?input_token=${accessToken}&access_token=${token}`,
                function (response) {
                    checkResponseFacebook(response, reject);
                    resolve(response);
                })
        });
    
        console.log('debug_token', userFacebookData);
        let facebookApiError = new ApplicationException('Facebook api bad response');
        if(!userFacebookData.data.is_valid){
            throw facebookApiError;
        }
        let facebookUserId = userFacebookData.data.user_id;

        let appUser = await this.userRepository.findOne({facebookUserId: facebookUserId});
        let isNewUser = false;
        if(!appUser){
            isNewUser = true;
            let userScopeData = await new Promise<any>((resolve, reject) => {
                fb.api(`/${facebookUserId}?fields=email,name`, 
                { access_token : `${accessToken}` },
                function(response) {
                    resolve(response)
                });
            });
            console.log('user_scope', userScopeData);
            if(!userScopeData){
                throw facebookApiError;
            }    
            appUser = await this.signUpByFacebook(facebookUserId, userScopeData.name, userScopeData.email);
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(appUser),
            isNewUser: isNewUser
        }
    }

    private async signUpByFacebook(facebookUserId: string, name: string, email: string): Promise<UserEntity>{
        if(!email){
            throw new ApplicationException('Email not found.')
        }
        await this.validateEmailForSignUp(email);

        let nameArr = name.split(' ');
        let firstName = (nameArr.length > 0) ? nameArr[0] : "unknown";
        let lastName = (nameArr.length > 1) ? nameArr[1] : "unknown";
        let password = this.generateRandomPassword();

        let appUser = this.userRepository.create({
            firstName: firstName,
            lastName: lastName,
            facebookUserId: facebookUserId,
            email: email,
            emailConfirmed: true,
            role: UserRole.CLIENT,
            passwordHash: this.getHashPassowrd(password).toString()
        });
        (async () => { 
            await this.emailService.sendUserPassword(email, `${firstName} ${lastName}`, password)
        })();
        await this.userRepository.save(appUser);
        return appUser;
    }

    private generateRandomPassword(): string{
        var randPassword = Array(environment.userGenerationPassword.passwordLength).
            fill(environment.userGenerationPassword.passwordChars).map((x) => 
            { return x[Math.floor(Math.random() * x.length)] }).join('');
        return randPassword;
    }

    private getHashPassowrd(password: string){
        return Md5.hashAsciiStr(password)
    }

    private getAccessToken(user: UserEntity): string {
        const accessToken = this.jwtService.sign({
            email: user.email,
            role: user.role,
            name: user.firstName,
            surname: user.lastName
        });
        return accessToken;
    }

    async validateUser(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ email: email })
        if (!user) {
            throw new ApplicationException('User not found!')
        }
        if (!user.isEmailConfirm) {
            throw new ApplicationException('Email is not confirmed!')
        }
        if (!user.isActive) {
            throw new ApplicationException('User is not active!')
        }
        return user;
    }

    async signUp(model: SignUpAuthModel): Promise<string> {
        await this.validateEmailForSignUp(model.email)
        let emailToken = this.emailJwtStrategy.create(model.email);

        const passwordHash = this.getHashPassowrd(model.password)
        const newUser = this.userRepository.create({
            email: model.email,
            isActive: true,
            firstName: model.firstName,
            lastName: model.lastName,
            passwordHash: passwordHash.toString(),
            role: UserRole.CLIENT,
            isEmailConfirm: false,
            emailConfirmedToken: emailToken
        });
        this.userRepository.save(newUser);

        await this.emailService.sendConfirmEmail(newUser.emailConfirmedToken, model.email)
        return "User is registered. Check your email inbox.";
    }

    private async validateEmailForSignUp(email: string): Promise<any>{
        const user = await this.userRepository.findOne({
            email: email
        })
        if (user) {
            throw new ApplicationException('User with such email already exists!')
        }
    }

    async confirmEmail(token: string): Promise<string> {
        let user = await this.userRepository.findOneOrFail({ emailConfirmedToken: token });
        if (!user || !user.isActive) {
            throw new ApplicationException('User not found!')
        }
        if (user.isEmailConfirm) {
            throw new ApplicationException('Email alredy confirmed!')
        }

        user.isEmailConfirm = true;
        await this.userRepository.update({ id: user.id }, user);
        return 'Email is confirmed.'
    }

    async getAll(): Promise<UserModel[]> {
        const users = await this.userRepository.find();
        return users.map(user => {
            return new UserModel(user);
        })
    }

}
