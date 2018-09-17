import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { MemberRegistrationDTO } from "../dto";
import { JsonObject, JsonProperty } from "json2typescript";
import DateUtils from "../../utils";

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({nullable: false})
  public firstName?: string;

  @Column({nullable: false})
  public lastName?: string;

  @Column({unique: true, nullable: false})
  public email?: string;

  @Column({unique: true, nullable: false})
  public phone?: string;

  @Column({default: new Date()})
  public created?: Date;

  @Column({default: Member.UNACTIVE})
  public status?: number;

  @Column()
  public passwordHash?: string;

  public static ACTIVE = 2;

  public static SUSPENDED = 1;

  public static UNACTIVE = 0;

  public static create(memberDTO: MemberRegistrationDTO): Member {
    const member: Member = new Member();
    member.firstName = memberDTO.firstName;
    member.lastName = memberDTO.lastName;
    member.email = memberDTO.email;
    member.phone = memberDTO.phone;
    member.passwordHash = bcrypt.hashSync(memberDTO.password, 10);
    member.created = new Date();
    member.status = Member.UNACTIVE;
    return member;
  }

}

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