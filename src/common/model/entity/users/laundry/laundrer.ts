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

	public static create(laundrer: ILaundrer): Laundrer {

		const laundrerEntity: Laundrer = new Laundrer();
		laundrerEntity.person = Person.create(laundrer);
		laundrerEntity.laundryPartner = laundrer.laundryPartner;

		return laundrerEntity;

	}

}