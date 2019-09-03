import { Repository, ObjectID, DeepPartial } from "typeorm";
import { EntityBase } from "src/entities/base.entity";

export class BaseMongoRepository<TEntity extends EntityBase> extends Repository<TEntity> {

    constructor(){
        super();
    }

    findBy = async (id: string | ObjectID) => {
        const result = await this.findOne(id);
        return result;
    }

    findByIds = async (ids: string[] | ObjectID[]) => {
        const result = new Array<TEntity>();
        for(let i=0;i<ids.length;i++){
            let id = ids[i];
            let ent = await this.findOne(id.toString())
            if(ent){
                result.push(ent);
            }
        }
        return result;
    }
}