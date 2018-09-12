import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public firstName?: string;

  @Column()
  public lastName?: string;

  @Column()
  public email?: string;

  @Column()
  public phone?: string;

  @Column()
  public created?: Date;

  @Column()
  public status?: number;

  @Column()
  public passwordHash?: string;

}