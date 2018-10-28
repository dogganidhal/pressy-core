import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Location {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: true})
  public placeId?: string;

  @Column({nullable: true, type: "float8"})
  public longitude?: number;

  @Column({nullable: true, type: "float8"})
  public latitude?: number;

}