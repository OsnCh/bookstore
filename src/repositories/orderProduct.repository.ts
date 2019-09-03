import { EntityRepository } from "typeorm";
import { OrderProductEntity } from "entities/orderProduct.entity";
import { BaseMongoRepository } from "./base.repository";

@EntityRepository(OrderProductEntity)
export class OrderProductRepository extends BaseMongoRepository<OrderProductEntity>{

}