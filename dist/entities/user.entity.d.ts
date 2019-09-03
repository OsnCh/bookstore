import { EntityBase } from './base.entity';
export declare enum UserRole {
    ADMIN = "admin",
    CLIENT = "user"
}
export declare class UserEntity extends EntityBase {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    emailConfirmed: boolean;
    isActive: boolean;
    isEmailConfirm: boolean;
    emailConfirmedToken: string;
    role: UserRole;
    googleUserId: string;
    facebookUserId: string;
}
