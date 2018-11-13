import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Person } from "../person";
import * as DTO from "../../../dto/index";
import {IUser} from "..";

@Entity()
export class Member implements IUser {

  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Person)
  @JoinColumn()
  public person: Person;

  public static create(createPersonRequest: DTO.person.CreatePersonRequest): Member {
    
    const member: Member = new Member();
    member.person = Person.create(createPersonRequest);

    return member;

  }

}