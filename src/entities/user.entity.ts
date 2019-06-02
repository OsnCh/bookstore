import { Column, Entity, PrimaryGeneratedColumn, ObjectIdColumn, ObjectID } from 'typeorm';
import { EntityBase } from './base.entity';

export enum UserRole {
    ADMIN = "admin",
    CLIENT = "user"
}

@Entity({name: "users"})
export class UserEntity extends EntityBase {
    @Column({ length: 500 })
    email: string;

    @Column({ length: 500 })
    firstName: string;

    @Column({ length: 500 })
    lastName: string;

    @Column({ length: 500 })
    passwordHash: string;

    @Column()
    emailConfirmed: boolean;

    @Column()
    isActive: boolean;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CLIENT
    })
    role: UserRole
}
