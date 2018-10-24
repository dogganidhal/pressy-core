import { Member } from './../users/member';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

export enum ActionVerb {
  // TODO: To be continued
  DRIVER_RECEIVED_BOOKING = 0
}

export enum ActionVictimType {
  // TODO: To be continued
  MEMBER = 0,
  BOOKING = 1
}

@Entity()
export class Action {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public verb: ActionVerb;

  @ManyToOne(type => Member, {nullable: false})
  @JoinColumn()
  public doer: Member;

  @Column({nullable: false})
  public victimId: number;

  @Column({nullable: false})
  public actionVictimType: ActionVictimType;

}