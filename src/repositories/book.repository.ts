import { BaseMongoRepository } from "./base.repository";
import { BookEntity } from "entities/book.entity";
import { EntityRepository, ObjectID } from "typeorm";

@EntityRepository(BookEntity)
export class BookRepository extends BaseMongoRepository<BookEntity>{
    constructor() {
        super();
    }
}