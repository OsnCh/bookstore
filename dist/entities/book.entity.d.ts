import { ObjectID } from 'typeorm';
import { BaseEntity } from './base.entity';
export declare class BookEntity extends BaseEntity {
    price: number;
    categoryId: ObjectID;
    name: string;
    isActive: boolean;
}
