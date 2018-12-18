import {Person, PersonStatus} from "./person";
import {JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

export abstract class User {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	public isActive(): boolean {
		return this.person.status === PersonStatus.ACTIVE;
	}

}