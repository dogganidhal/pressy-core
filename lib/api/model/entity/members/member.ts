import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { MemberRegistrationDTO } from "../../dto";

export enum MemberStatus {
  UNACTIVE = 1,
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

  @Column({nullable: false})
  public firstName: string;

  @Column({nullable: false})
  public lastName: string;

  @Column({unique: true, nullable: false})
  public email: string;

  @Column({unique: true, nullable: false})
  public phone: string;

  @CreateDateColumn()
  public created: Date;

  @Column({default: MemberStatus.UNACTIVE})
  public status: MemberStatus;

  @Column()
  public passwordHash: string;

  @Column({unique: true, nullable: false})
  public secret: string;

  @Column({default: MemberGroup.CUSTOMER})
  public group: MemberGroup;

  public static create(memberDTO: MemberRegistrationDTO, memberGroup: MemberGroup = MemberGroup.CUSTOMER): Member {
    const member: Member = new Member();
    member.firstName = memberDTO.firstName;
    member.lastName = memberDTO.lastName;
    member.email = memberDTO.email;
    member.phone = memberDTO.phone;
    member.passwordHash = bcrypt.hashSync(memberDTO.password, 10);
    member.status = MemberStatus.UNACTIVE;
    member.group = memberGroup;
    member.secret = uuid.v4().toString();
    return member;
  }

  public static createCustomer(memberDTO: MemberRegistrationDTO): Member {
    return Member.create(memberDTO, MemberGroup.CUSTOMER);
  }

  public static createDriver(memberDTO: MemberRegistrationDTO): Member {
    return Member.create(memberDTO, MemberGroup.DRIVER);
  }

  public static createLaundry(memberDTO: MemberRegistrationDTO): Member {
    return Member.create(memberDTO, MemberGroup.LAUNDRY);
  }

  public static createSuperuser(memberDTO: MemberRegistrationDTO): Member {
    return Member.create(memberDTO, MemberGroup.SUPERUSER);
  }

}