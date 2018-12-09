import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import {Person, PersonStatus} from "../person";
import {IUser} from "..";
import {LaundryPartner} from ".";
import { CreatePersonRequest } from "../../../dto";

export interface ILaundrer extends CreatePersonRequest {
	laundryPartner: LaundryPartner;
}

@Entity()
export class Laundrer implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	@ManyToOne(type => LaundryPartner)
	@JoinColumn()
	public laundryPartner: LaundryPartner;

	public isActive(): boolean {
		return this.person.status === PersonStatus.ACTIVE;
	}

	public static create(laundrer: ILaundrer): Laundrer {

		const laundrerEntity: Laundrer = new Laundrer();
		laundrerEntity.person = Person.create(laundrer);
		laundrerEntity.laundryPartner = laundrer.laundryPartner;

		return laundrerEntity;

	}

}