import { DateUtils } from '../../../utils';
import bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import * as DTO from "../../dto";

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

  public static create(createMemberRequest: DTO.member.CreateMemberRequest): Person {

    const person = new Person;

    person.firstName = createMemberRequest.firstName;
    person.lastName = createMemberRequest.lastName;
    person.passwordHash = bcrypt.hashSync(createMemberRequest.password, 10);
    person.phone = createMemberRequest.phone;
    person.email = createMemberRequest.email;

    return person;

  }

}