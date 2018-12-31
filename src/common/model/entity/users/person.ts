import { DateUtils } from '../../../utils';
import bcrypt from 'bcrypt';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import uuid from "uuid";
import { CreatePersonRequestDto } from '../../dto';


export enum PersonActivationStatus {
  INACTIVE = 1,
	PENDING_EMAIL_ACTIVATION = 3,
  SUSPENDED = 2,
  ACTIVE = 4
}


@Entity()
export class Person {

	private static IS_EMAIL_VALIDATED_MASK = 1 << 0;
	private static IS_PHONE_VALIDATED_MASK = 1 << 1;

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

  @Column({nullable: false, default: PersonActivationStatus.INACTIVE})
  public status: PersonActivationStatus = PersonActivationStatus.INACTIVE;

  @Column()
  public passwordHash: string;

  public setEmailValidated() {
  	this.status |= Person.IS_EMAIL_VALIDATED_MASK;
	}

	public setPhoneValidated() {
		this.status |= Person.IS_PHONE_VALIDATED_MASK;
	}

	public isEmailValidated(): boolean {
		return (this.status & Person.IS_EMAIL_VALIDATED_MASK) != 0;
	}

	public isPhoneValidated(): boolean {
  	return (this.status & Person.IS_PHONE_VALIDATED_MASK) != 0;
	}

  public static create(createPersonRequest: CreatePersonRequestDto): Person {

    const person = new Person;

    person.firstName = createPersonRequest.firstName;
    person.lastName = createPersonRequest.lastName;
    person.passwordHash = bcrypt.hashSync(createPersonRequest.password, 10);
    person.phone = createPersonRequest.phone;
    person.email = createPersonRequest.email;

    return person;

  }

}

abstract class ValidationCode {

	@PrimaryColumn()
	public code: string;

	@OneToOne(type => Person)
	@JoinColumn()
	public person: Person;

}

@Entity()
export class EmailValidationCode extends ValidationCode {

	public static create(person: Person): EmailValidationCode {
		const activationCode = new EmailValidationCode();
		activationCode.code = uuid.v4().toString();
		activationCode.person = person;
		return activationCode;
	}

}

@Entity()
export class PhoneValidationCode extends ValidationCode {

	public static create(person: Person): PhoneValidationCode {
		const activationCode = new PhoneValidationCode();
		activationCode.code = uuid.v4().toString();
		activationCode.person = person;
		return activationCode;
	}

}