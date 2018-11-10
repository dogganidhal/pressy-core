import { Entity, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import uuid from "uuid";
import { Person } from "./person";
import * as DTO from "../../dto";

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Person)
  @JoinColumn()
  public person: Person;

  public static create(createMemberRequest: DTO.member.CreateMemberRequest): Member {
    
    const member: Member = new Member();
    member.person = Person.create(createMemberRequest);

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