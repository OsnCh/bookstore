import { Column,  Entity } from "typeorm";
import { EntityBase } from "./base.entity";
import { OrderStatus } from "common/enums/orderStatus.enum";

@Entity({name: "orders"})
export class OrderEntity extends EntityBase{
    @Column()
    userId: string;
    @Column()
    orderProductIds: Array<string>
    @Column({ default: OrderStatus.WAITINGCONFIRMATION })
    status: OrderStatus
}