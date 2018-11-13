import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Person } from "../person";
import * as DTO from "../../../dto/index";
import {IUser} from "..";

@Entity()
export class Driver implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	public static create(createDriverRequest: DTO.person.CreatePersonRequest): Driver {

		const driver: Driver = new Driver();
		driver.person = Person.create(createDriverRequest);

		return driver;

	}

}