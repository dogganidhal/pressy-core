import { Entity, PrimaryColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import * as uuid from "uuid";
import { DateUtils } from "../../../utils";
import { Person } from "./person";


@Entity()
export class PasswordResetCode {

  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => Person, {eager: true})
  public person: Person;

  @CreateDateColumn()
  public created: Date;
  
  @Column({nullable: false})
  public expiryDate: Date;

  public static create(person: Person): PasswordResetCode {

    const memberReset: PasswordResetCode = new PasswordResetCode;

    memberReset.id = uuid.v4().toString();
    memberReset.person = person;
    memberReset.expiryDate = DateUtils.addDaysFromNow(1);

    return memberReset;
  }

}