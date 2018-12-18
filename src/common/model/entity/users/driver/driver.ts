import {Entity, OneToMany} from "typeorm";
import {Person, PersonActivationStatus} from "../person";
import {User} from "..";
import {DriverSlot} from "./driver-slot";
import { CreatePersonRequest } from "../../../dto";


@Entity()
export class Driver extends User {

	@OneToMany(type => DriverSlot, driverSlot => driverSlot.driver)
	public slots: Array<DriverSlot>;

	public isActive(): boolean {
		return this.person.status === PersonActivationStatus.ACTIVE;
	}

	public static create(createDriverRequest: CreatePersonRequest): Driver {

		const driver: Driver = new Driver();
		driver.person = Person.create(createDriverRequest);

		return driver;

	}

}