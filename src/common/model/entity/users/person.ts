import { DateUtils } from '../../../utils';
import bcrypt from 'bcrypt';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import uuid from "uuid";
import { CreatePersonRequest } from '../../dto';

export enum PersonStatus {
  INACTIVE = 1,
  SUSPENDED = 2,
  ACTIVE = 4
}


@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public firstName: string;

  @Column({nullable: false})
  public lastName: string;

  @Column({unique: true, nullable: false})
  public email: string;

  @Column({unique: true, nullable: false})
  public phone: string;

  @CreateDateColumn()
  public created: Date = DateUtils.now();

  @Column({nullable: false, default: PersonStatus.INACTIVE})
  public status: PersonStatus = PersonStatus.INACTIVE;

  @Column()
  public passwordHash: string;

  public static create(createPersonRequest: CreatePersonRequest): Person {

    const person = new Person;

    person.firstName = createPersonRequest.firstName;
    person.lastName = createPersonRequest.lastName;
    person.passwordHash = bcrypt.hashSync(createPersonRequest.password, 10);
    person.phone = createPersonRequest.phone;
    person.email = createPersonRequest.email;

    return person;

  }

}

@Entity()
export class ActivationCode {

	@PrimaryColumn()
	public code: string;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

	public static create(person: Person): ActivationCode {
		const activationCode = new ActivationCode();
		activationCode.code = uuid.v4().toString();
		activationCode.person = person;
		return activationCode;
	}

}