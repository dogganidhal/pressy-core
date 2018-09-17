import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";
import { MemberRegistrationDTO } from "../dto";

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