import { EntityRepository } from "typeorm";
import { OrderProductEntity } from "src/entities/orderProduct.entity";
import { BaseMongoRepository } from "./base.repository";

@EntityRepository(OrderProductEntity)
export class OrderProductRepository extends BaseMongoRepository<OrderProductEntity>{

}