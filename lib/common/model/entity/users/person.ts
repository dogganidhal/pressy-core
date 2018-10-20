import { DateUtils } from './../../../utils/date-utils';
import bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { MemberRegistrationDTO } from "../../dto/member";

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

  @Column()
  public passwordHash: string;

  public static create(memberDTO: MemberRegistrationDTO): Person {

    const person = new Person;

    person.firstName = memberDTO.firstName;
    person.lastName = memberDTO.firstName;
    person.passwordHash = bcrypt.hashSync(memberDTO.password, 10);
    person.phone = memberDTO.phone;
    person.email = memberDTO.email;

    return person;

  }

}