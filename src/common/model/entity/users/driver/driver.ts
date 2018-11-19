import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, OneToMany} from "typeorm";
import { Person } from "../person";
import * as DTO from "../../../dto/index";
import {IUser} from "..";
import {DriverSlot} from "./driver-slot";


@Entity()
export class Driver implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	@OneToMany(type => DriverSlot, driverSlot => driverSlot.driver)
	public slots: Array<DriverSlot>;

	public static create(createDriverRequest: DTO.person.CreatePersonRequest): Driver {

		const driver: Driver = new Driver();
		driver.person = Person.create(createDriverRequest);

		return driver;

	}

}