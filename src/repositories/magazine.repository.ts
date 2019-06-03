import { BaseMongoRepository } from "./base.repository";
import { MagazineEntity } from "src/entities/magazine.entity";
import { EntityRepository } from "typeorm";

@EntityRepository(MagazineEntity)
export class MagazineRepository extends BaseMongoRepository<MagazineEntity>{

}