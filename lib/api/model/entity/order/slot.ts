import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Slot {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public startDate: Date;

  @Column()
  public endDate: Date;
  
}