import { AuthService } from '../services/auth.service';
import { SignInAuthModel } from 'src/models';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: SignInAuthModel): Promise<import("../models").TokenAuthModel>;
}
export {};
