import { EntityBase } from "./base.entity";
import { Column, ObjectID, Entity } from "typeorm";

@Entity({name: 'Magazines'})
export class MagazineEntity extends EntityBase{
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    price: number;
    @Column()
    categoryId: ObjectID;
    @Column()
    isActive: boolean;
}