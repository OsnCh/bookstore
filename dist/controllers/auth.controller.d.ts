import { AuthService } from 'services/auth.service';
import { SignInAuthModel } from 'models/auth/signIn.model';
import { TokenAuthModel } from 'models/auth/tokenAuth.model';
import { SignUpAuthModel } from 'models/auth/signUp.model';
import { UserModel } from 'models/auth/user.model';
import { SignInGoogleModel } from 'models/auth/signInGoogle.model';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(model: SignInAuthModel): Promise<TokenAuthModel>;
    signInByGoogle(model: SignInGoogleModel): Promise<TokenAuthModel>;
    signInByFacebook(token: string): Promise<TokenAuthModel>;
    signUp(model: SignUpAuthModel): Promise<string>;
    getAll(): Promise<UserModel[]>;
    emailConfirm(token: string): Promise<string>;
}
