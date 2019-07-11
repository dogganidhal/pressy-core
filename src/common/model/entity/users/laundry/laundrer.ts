import {Entity, JoinColumn, ManyToOne} from "typeorm";
import {Person, PersonActivationStatus} from "../person";
import {User} from "..";
import {LaundryPartner} from ".";
import { CreatePersonRequestDto } from "../../../dto";

export interface ILaundrer extends CreatePersonRequestDto {
	laundryPartner: LaundryPartner;
}

@Entity()
export class Laundrer extends User {

	@ManyToOne(type => LaundryPartner)
	@JoinColumn()
	public laundryPartner: LaundryPartner;

	public isActive(): boolean {
		return this.person.status === PersonActivationStatus.ACTIVE;
	}

	public static create(request: CreatePersonRequestDto, laundryPartner: LaundryPartner): Laundrer {

		let laundrer = new Laundrer();
		laundrer.person = Person.create(request);
		laundrer.laundryPartner = laundryPartner;
		return laundrer;

	}

}