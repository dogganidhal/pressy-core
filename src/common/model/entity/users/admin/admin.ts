import {IUser} from "../index";
import {Person, PersonStatus} from "../person";
import {Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";


@Entity()
export class Admin implements IUser {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	public isActive(): boolean {
		return this.person.status == PersonStatus.ACTIVE;
	}

}