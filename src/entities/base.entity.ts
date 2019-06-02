import { Column, Entity, ObjectIdColumn, ObjectID, BaseEntity } from 'typeorm';

export class EntityBase extends BaseEntity {
  constructor(){
    super();
    this.creationDate = new Date(Date.now()).toUTCString();
  }

  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  creationDate: string;
}