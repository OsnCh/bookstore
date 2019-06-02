import { UserRole, UserEntity } from "src/entities/user.entity";
export declare class UserModel {
    constructor(entity: UserEntity);
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
