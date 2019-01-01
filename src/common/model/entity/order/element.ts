import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column,} from "typeorm";

@Entity()
export class Element {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public name: string;

  @Column({nullable: false})
  public laundryPrice: number;

  @Column({nullable: true})
  public comment?: string;

}