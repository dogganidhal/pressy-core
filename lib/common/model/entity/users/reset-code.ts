import { Entity, PrimaryColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import * as uuid from "uuid";
import { DateUtils } from "../../../utils";
import { Member } from "./member";
import { Person } from "./person";


@Entity()
export class PersonPasswordResetCode {

  @PrimaryColumn()
  public id?: string;

  @ManyToOne(type => Person)
  public person: Person;

  @CreateDateColumn()
  public created: Date;
  
  @Column({nullable: false})
  public expiryDate: Date;

  public static create(person: Person): PersonPasswordResetCode {

    const memberReset: PersonPasswordResetCode = new PersonPasswordResetCode;

    memberReset.id = uuid.v4().toString();
    memberReset.person = person;
    memberReset.expiryDate = DateUtils.addDaysFromNow(1);

    return memberReset;
  }

}