import { BaseMongoRepository } from "./base.repository";
import { CategoryEntity } from "entities/category.entity";
import { EntityRepository } from "typeorm";

@EntityRepository(CategoryEntity)
export class CategoryRepository extends BaseMongoRepository<CategoryEntity>{

}