import { ObjectID } from 'typeorm';
import { EntityBase } from './base.entity';
export declare class BookEntity extends EntityBase {
    price: number;
    categoryId: ObjectID;
    name: string;
    isActive: boolean;
    description: string;
}
