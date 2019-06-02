import { Repository, ObjectID, DeepPartial } from "typeorm";
import { EntityBase } from "src/entities/base.entity";

export class BaseMongoRepository<TEntity extends EntityBase> extends Repository<TEntity> {

    constructor(){
        super();
       //super.create();
    }

    findBy = async (id: string | ObjectID) => {
        const result = await this.findOne(id);
        return result;
    }

    findByIds = async (ids: string[] | ObjectID[]) => {
        const result = await this.findByIds(ids)
        return result;
    }

    // create = async (item:  TEntity) => {
    //     await this.insert(item);
    //     await this.save();
    // }

    // getList = async () => {
        
    // }
}