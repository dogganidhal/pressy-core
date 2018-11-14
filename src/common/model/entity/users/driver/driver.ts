import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, OneToMany} from "typeorm";
import { Person } from "../person";
import * as DTO from "../../../dto/index";
import {IUser} from "..";
import {DriverAvailability} from "./driver-availability";


@Entity()
export class Driver implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	@OneToMany(type => DriverAvailability, driverAvailability => driverAvailability.driver)
	public availabilities: Array<DriverAvailability>;

	public static create(createDriverRequest: DTO.person.CreatePersonRequest): Driver {

		const driver: Driver = new Driver();
		driver.person = Person.create(createDriverRequest);

		return driver;

	}

}