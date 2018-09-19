import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import * as uuid from "uuid";
import { DateUtils } from "../../../utils";
import { Member } from ".";


@Entity()
export class MemberPasswordResetCode {

  @PrimaryColumn()
  public id?: string;

  @ManyToOne(type => Member)
  public member?: Member;

  @Column({default: DateUtils.now()})
  public created?: Date;
  
  @Column({default: DateUtils.addDays(1)})
  public expiryDate?: Date;

  public static create(member: Member): MemberPasswordResetCode {
    const memberReset: MemberPasswordResetCode = new MemberPasswordResetCode();

    memberReset.id = uuid.v4().toString();
    memberReset.member = member;

    return memberReset;
  }

}