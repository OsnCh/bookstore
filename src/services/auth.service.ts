import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenAuthModel, SignUpAuthModel } from 'src/models';
import { SignInAuthModel } from 'src/models/auth/signIn.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/entities/user.entity';
import { UserModel } from '../models'
import { Repository } from 'typeorm';
import { Md5 } from 'ts-md5/dist/md5';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository) {

    }

    async signIn(model: SignInAuthModel): Promise<TokenAuthModel> {
        const user = await this.validateUser(model.email);
        if (Md5.hashAsciiStr(model.password) != user.passwordHash) {
            throw Error('User not found!')
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
            throw Error('User not found!')
        }
        return user;
    }

    async signUp(model: SignUpAuthModel): Promise<TokenAuthModel> {
         const user = await this.userRepository.findOne({
             email: model.email
         })
         if (user) {
             throw Error('User has already exist!')
         }

        const passwordHash = Md5.hashAsciiStr(model.password)
        const newUser = this.userRepository.create({
            email: model.email,
            isActive: true,
            firstName: model.firstName,
            lastName: model.lastName,
            passwordHash: passwordHash.toString(),
            role: UserRole.CLIENT
        })
        this.userRepository.save(newUser);
        const accessToken = this.jwtService.sign({
            email: newUser.email,
            role: newUser.role,
            name: newUser.firstName,
            surname: newUser.lastName
        });
        return {
            expiresIn: 3600,
            accessToken
        };
    }

    async getAll(): Promise<UserModel[]> {
        const users = await this.userRepository.find();
        return users.map(user => {
            return new UserModel(user);
        })
    }
}
