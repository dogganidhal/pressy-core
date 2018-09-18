import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { MemberRegistrationDTO } from "../dto";
import { DateUtils } from "../../utils";

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

export enum AccessPrivilege {
  BASIC = 0,
  PERSONAL = 1,
  SUPERUSER = 4
}

@Entity()
export class AccessToken {

  @PrimaryColumn()
  public code: string = "";

  @Column({default: AccessPrivilege.BASIC})
  public privilege: number = AccessPrivilege.BASIC;

  @Column({default: DateUtils.addHours(1)})
  public expiryDate: Date = DateUtils.addHours(1);

  @ManyToOne(type => Member)
  public member?: Member;

  public static create(code: string, member: Member): AccessToken {
    const accessToken = new AccessToken();
    accessToken.code = code;
    accessToken.member = member;
    accessToken.expiryDate = DateUtils.addHours(1);
    accessToken.privilege = AccessPrivilege.PERSONAL;
    return accessToken;
  }

}

@Entity()
export class RefreshToken {

  @PrimaryColumn()
  public code: string = "";

  @Column({default: AccessPrivilege.BASIC})
  public privilege: number = AccessPrivilege.BASIC;

  @ManyToOne(type => Member)
  public member?: Member;

  public static create(code: string, member: Member): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.code = code;
    refreshToken.member = member;
    refreshToken.privilege = AccessPrivilege.PERSONAL;
    return refreshToken;
  }

}