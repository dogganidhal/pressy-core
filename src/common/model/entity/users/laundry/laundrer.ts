import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Person } from "../person";
import * as DTO from "../../../dto";
import {IUser} from "..";
import {LaundryPartner} from ".";

export interface ILaundrer extends DTO.person.CreatePersonRequest {
	laundryPartner: LaundryPartner;
}

@Entity()
export class Laundrer implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person, {eager: true})
	@JoinColumn()
	public person: Person;

	@ManyToOne(type => LaundryPartner)
	@JoinColumn()
	public laundryPartner: LaundryPartner;

	public static create(laundrer: ILaundrer): Laundrer {

		const laundrerEntity: Laundrer = new Laundrer();
		laundrerEntity.person = Person.create(laundrer);
		laundrerEntity.laundryPartner = laundrer.laundryPartner;

		return laundrerEntity;

	}

}