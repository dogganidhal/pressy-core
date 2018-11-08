
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";

export abstract class StatusUpdate {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public time: Date;

}