import {PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {Person} from "../users/person";
import { User } from "../users";
import { Member } from "../users/member";
import { Driver } from "../users/driver/driver";
import { Admin } from "../users/admin/admin";
import { Laundrer } from "../users/laundry/laundrer";

export enum StatusUpdateDoerIdentity {
	MEMBER, DRIVER, LAUNDRER, ADMIN, SUPERUSER
}

export namespace StatusUpdateDoerIdentity {

	export function fromUser(user: User): StatusUpdateDoerIdentity {
		
		if (user instanceof Member)
			return StatusUpdateDoerIdentity.MEMBER;
		if (user instanceof Driver)
			return StatusUpdateDoerIdentity.DRIVER;
		if (user instanceof Admin)
			return StatusUpdateDoerIdentity.ADMIN;
		if (user instanceof Laundrer)
			return StatusUpdateDoerIdentity.LAUNDRER;
			
		return StatusUpdateDoerIdentity.SUPERUSER;

	}

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