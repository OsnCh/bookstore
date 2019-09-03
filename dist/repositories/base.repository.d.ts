import { Repository, ObjectID } from "typeorm";
import { EntityBase } from "entities/base.entity";
export declare class BaseMongoRepository<TEntity extends EntityBase> extends Repository<TEntity> {
    constructor();
    findBy: (id: string | ObjectID) => Promise<TEntity>;
    findByIds: (ids: string[] | ObjectID[]) => Promise<TEntity[]>;
}
