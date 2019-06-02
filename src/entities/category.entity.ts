import { Column, Entity } from "typeorm";
import { EntityBase } from "./base.entity";

@Entity({name: "categories"})
export class CategoryEntity extends EntityBase{
    @Column()
    name: string;
    @Column()
    description: string;
}