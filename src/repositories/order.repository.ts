import { OrderEntity } from "src/entities/order.entity";
import { BaseMongoRepository } from "./base.repository";
import { EntityRepository } from "typeorm";

@EntityRepository(OrderEntity)
export class OrderRepository extends BaseMongoRepository<OrderEntity>{

}