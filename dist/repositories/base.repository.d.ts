import { Repository, ObjectID } from "typeorm";
import { BaseEntity } from "src/entities/base.entity";
export declare class BaseMongoRepository<TEntity extends BaseEntity> extends Repository<TEntity> {
    findBy: (id: string | ObjectID) => Promise<TEntity>;
    findByIds: (ids: string[] | ObjectID[]) => any;
}
