import { JwtService } from '@nestjs/jwt';
import { TokenAuthModel, SignUpAuthModel } from 'src/models';
import { SignInAuthModel } from 'src/models/auth/signIn.model';
import { UserModel } from '../models';
import { UserRepository } from 'src/repositories/user.repository';
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: UserRepository);
    signIn(model: SignInAuthModel): Promise<TokenAuthModel>;
    signUp(model: SignUpAuthModel): Promise<TokenAuthModel>;
    getAll(): Promise<UserModel[]>;
}
