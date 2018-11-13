import {PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {Person} from "../users/person";

export enum StatusUpdateDoerIdentity {
	MEMBER, DRIVER, LAUNDRER, ADMIN, SUPERUSER
}

export abstract class StatusUpdate {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public time: Date;

	@ManyToOne(type => Person)
	@JoinColumn()
	public doer: Person;

	@Column({nullable: false})
	public doerIdentity: StatusUpdateDoerIdentity;

}