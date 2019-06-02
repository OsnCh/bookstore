import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';
import { EntityBase } from './base.entity';

@Entity({name: "books"})
export class BookEntity extends EntityBase {
  @Column()
  price: number;

  @Column('string', { nullable: false })
  categoryId: ObjectID;

  @Column({ length: 500 })
  name: string;

  @Column()
  isActive: boolean;

  @Column()
  description: string;
}
