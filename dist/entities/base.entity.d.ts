import { ObjectID, BaseEntity } from 'typeorm';
export declare class EntityBase extends BaseEntity {
    constructor();
    id: ObjectID;
    creationDate: string;
}
