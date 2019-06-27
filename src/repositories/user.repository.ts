import { BaseMongoRepository } from "./base.repository";
import { UserEntity } from "src/entities/user.entity";
import { EntityRepository } from "typeorm/decorator/EntityRepository";

@EntityRepository(UserEntity)
export class UserRepository extends BaseMongoRepository<UserEntity>{
    constructor(){
        super();
    }
}