import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthModel } from 'src/models/auth/signIn.model';
import { UserEntity, UserRole } from 'src/entities/user.entity';
import { Md5 } from 'ts-md5/dist/md5';
import { UserRepository } from 'src/repositories/user.repository';
import { TokenAuthModel } from 'src/models/auth/tokenAuth.model';
import { SignUpAuthModel } from 'src/models/auth/signUp.model';
import { UserModel } from 'src/models/auth/user.model';
import { ApplicationException } from 'src/common/exceptions/application.exception';
import { EmailService } from './email.sevice';
import { EmailJwtStrategy } from 'src/common/email-jwt.strategy';
import { SignInGoogleModel } from 'src/models/auth/signInGoogle.model';
import { Facebook, FacebookApiException } from 'fb';
import { Roles } from 'src/common';

function checkResponseFacebook(response, rejectObj) {
    if (response && !response.error) {
        return;
    }
    let error = !response ? 'Facebook api error.' : response.error;
    throw new ApplicationException(error);
    rejectObj();
}

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
        private readonly emailJwtStrategy: EmailJwtStrategy) {

    }

    async signIn(model: SignInAuthModel): Promise<TokenAuthModel> {
        const user = await this.validateUser(model.email);
        if (!user || Md5.hashAsciiStr(model.password) != user.passwordHash) {
            throw new ApplicationException('User not found!')
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(user)
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
            throw new ApplicationException('Google services error')
        }
        const userid = payload['sub'] as string;

        let appUser = await this.userRepository.findOne({ googleUserId: userid });
        if (!appUser) {
            appUser = await this.signUpGoogle({
                email: payload['email'],
                firstName: payload['given_name'],
                lastName: payload['family_name'],
            } as SignUpAuthModel, userid)
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(appUser)
        }
    }

    private async signUpGoogle(model: SignUpAuthModel, userGoogleId: string): Promise<UserEntity> {
        let user = this.userRepository.create({
            email: model.email,
            firstName: model.firstName,
            lastName: model.lastName,
            emailConfirmed: true,
            googleUserId: userGoogleId,
            role: UserRole.CLIENT
        });
        await this.userRepository.save(user);
        return user;
    }

    async signInFacebook(accessToken: string): Promise<TokenAuthModel> {
        const fb = new Facebook({ version: 'v3.3' });
        let token = await new Promise<string>((resolve, reject) => {
            fb.api('oauth/access_token', {
                client_id: '200824017475143',
                client_secret: '23ab295cf12b2f954df3b250e27ce75d',
                grant_type: 'client_credentials'
            }, function (res) {
                checkResponseFacebook(res, reject);
                var accessToken = res.access_token;
                resolve(accessToken);
            })
        });
        let userFacebookData = await new Promise<any>((resolve, reject) => {
            fb.api(`/debug_token?input_token=${accessToken}&access_token=${token}`,
                function (response) {
                    checkResponseFacebook(response, reject);
                    resolve(response);
                })
        });
        if(!userFacebookData.data.is_valid){
            console.log(userFacebookData);
            throw new ApplicationException('Facebook token not valid')
        }
        let facebookUserId = userFacebookData.data.user_id;
        let appUser = await this.userRepository.findOne({facebookUserId: facebookUserId});
        if(!appUser){
            appUser = await this.signUpByFacebook(facebookUserId);
        }
        return {
            expiresIn: 3600,
            accessToken: this.getAccessToken(appUser)
        }
    }

    private async signUpByFacebook(facebookUserId: string): Promise<UserEntity>{
        const facebook_alias = 'facebook_user';
        let appUser = this.userRepository.create({
            firstName: facebook_alias,
            lastName: facebook_alias,
            facebookUserId: facebookUserId,
            email: facebook_alias,
            emailConfirmed: true,
            role: UserRole.CLIENT
        })
        await this.userRepository.save(appUser);
        return appUser;
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
        const user = await this.userRepository.findOne({
            email: model.email
        })
        if (user) {
            throw new ApplicationException('User with such email already exists!')
        }

        let emailToken = this.emailJwtStrategy.create(model.email);

        const passwordHash = Md5.hashAsciiStr(model.password)
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

        await this.emailService.sendEmail('nodewarehouse@gmail.com',
            model.email, 'Link for confirm email!',
            `<br/>
             Your link for confirm email.
             <br/>
             <a href='http://localhost:3001/api/auth/confirm/${newUser.emailConfirmedToken}'>Confirm</a>`);
        return "User is registered. Check your email inbox.";
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
