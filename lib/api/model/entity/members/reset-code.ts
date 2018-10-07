import { Entity, PrimaryColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import * as uuid from "uuid";
import { DateUtils } from "../../../utils";
import { Member } from ".";


@Entity()
export class MemberPasswordResetCode {

  @PrimaryColumn()
  public id?: string;

  @ManyToOne(type => Member)
  public member?: Member;

  @CreateDateColumn()
  public created: Date;
  
  @Column({nullable: false})
  public expiryDate: Date;

  public static create(member: Member): MemberPasswordResetCode {
    const memberReset: MemberPasswordResetCode = new MemberPasswordResetCode();

    memberReset.id = uuid.v4().toString();
    memberReset.member = member;
    memberReset.expiryDate = DateUtils.addDaysFromNow(1);

    return memberReset;
  }

}