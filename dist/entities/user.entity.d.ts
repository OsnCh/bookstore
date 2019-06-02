import { BaseEntity } from './base.entity';
export declare enum UserRole {
    ADMIN = "admin",
    CLIENT = "user"
}
export declare class UserEntity extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    emailConfirmed: boolean;
    isActive: boolean;
    role: UserRole;
}
