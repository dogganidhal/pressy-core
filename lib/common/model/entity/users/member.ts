import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import uuid from "uuid";
import { MemberRegistrationDTO } from "../../dto/member";
import { Person } from "./person";

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Person)
  @JoinColumn()
  public person: Person;

  public static create(memberDTO: MemberRegistrationDTO): Member {
    
    const member: Member = new Member();
    member.person = Person.create(memberDTO);

    return member;

  }

}

@Entity()
export class PersonActivationCode {

  @PrimaryColumn()
  public code: string;

  @OneToOne(type => Person)
  @JoinColumn()
  public person: Person;

  public static create(person: Person): PersonActivationCode {
    const activationCode = new PersonActivationCode();
    activationCode.code = uuid.v4().toString();
    activationCode.person = person;
    return activationCode;
  }

}