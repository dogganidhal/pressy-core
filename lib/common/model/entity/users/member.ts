import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { MemberRegistrationDTO } from "../../dto/member";
import { Person } from "./person";

export enum MemberStatus {
  INACTIVE = 1,
  SUSPENDED = 2,
  ACTIVE = 4
}

export enum MemberGroup {
  CUSTOMER = 1,
  DRIVER = 2,
  LAUNDRY = 4,
  SUPERUSER = 8
}

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Person)
  public person: Person;

  @Column()
  public status: MemberStatus = MemberStatus.INACTIVE;

  @Column()
  public group: MemberGroup = MemberGroup.CUSTOMER;

  public static create(memberDTO: MemberRegistrationDTO, memberGroup: MemberGroup = MemberGroup.CUSTOMER): Member {
    
    const member: Member = new Member();
    
    member.person = Person.create(memberDTO);
    member.status = MemberStatus.INACTIVE;
    member.group = memberGroup;

    return member;

  }

}

@Entity()
export class MemberActivationCode {

  @PrimaryColumn()
  public code: string;

  @OneToOne(type => Member)
  @JoinColumn()
  public member: Member;

  public static create(member: Member): MemberActivationCode {
    const activationCode = new MemberActivationCode();
    activationCode.code = uuid.v4().toString();
    activationCode.member = member;
    return activationCode;
  }

}