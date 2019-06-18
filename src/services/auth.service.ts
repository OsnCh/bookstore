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
        const accessToken = this.jwtService.sign({
            email: user.email,
            role: user.role,
            name: user.firstName,
            surname: user.lastName
        });
        return {
            expiresIn: 3600,
            accessToken
        };
    }

    async validateUser(email: string): Promise<UserEntity>{
        const user =  await this.userRepository.findOne({email: email})
        if (!user)  {
            throw new ApplicationException('User not found!')
        }
        if(!user.isEmailConfirm){
            throw new ApplicationException('Email is not confirmed!')
        }
        if(!user.isActive){
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

    async confirmEmail(token: string): Promise<string>{
        let user = await this.userRepository.findOneOrFail({emailConfirmedToken: token});
        if(!user || !user.isActive){
            throw new ApplicationException('User not found!')
        }
        if(user.isEmailConfirm){
            throw new ApplicationException('Email alredy confirmed!')
        }

        user.isEmailConfirm = true;
        await this.userRepository.update({ id: user.id },user);
        return 'Email is confirmed.'
    }

    async getAll(): Promise<UserModel[]> {
        const users = await this.userRepository.find();
        return users.map(user => {
            return new UserModel(user);
        })
    }
}
