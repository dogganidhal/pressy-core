import {Entity, JoinColumn, OneToMany} from "typeorm";
import {Person} from "../person";
import {User} from "..";
import {Address} from "../../common/address";
import { CreatePersonRequest } from "../../../dto";


@Entity()
export class Member extends User {

  @OneToMany(type => Address, address => address.member)
  @JoinColumn()
  public addresses: Address[];

  public static create(createPersonRequest: CreatePersonRequest): Member {
    
    const member: Member = new Member();
    member.person = Person.create(createPersonRequest);

    return member;

  }

}