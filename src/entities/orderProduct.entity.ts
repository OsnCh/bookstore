import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";
import { EntityBase } from "./base.entity";
import { ProductType } from "src/common/enums/productType.enum";

@Entity({name: 'order_products'})
export class OrderProductEntity extends EntityBase{
    @Column()
    productId: string;
    @Column()
    type: ProductType;
    @Column()
    count: number;
}