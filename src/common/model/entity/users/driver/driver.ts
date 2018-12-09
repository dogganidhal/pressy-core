import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, OneToMany} from "typeorm";
import {Person, PersonStatus} from "../person";
import {IUser} from "..";
import {DriverSlot} from "./driver-slot";
import { CreatePersonRequest } from "../../../dto";


@Entity()
export class Driver implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	@OneToMany(type => DriverSlot, driverSlot => driverSlot.driver)
	public slots: Array<DriverSlot>;

	public isActive(): boolean {
		return this.person.status === PersonStatus.ACTIVE;
	}

	public static create(createDriverRequest: CreatePersonRequest): Driver {

		const driver: Driver = new Driver();
		driver.person = Person.create(createDriverRequest);

		return driver;

	}

}