import {Entity, JoinColumn, OneToMany} from "typeorm";
import {Person} from "../person";
import {User} from "..";
import {Address} from "../../common/address";
import { CreatePersonRequestDto } from "../../../dto";


@Entity()
export class Member extends User {

  @OneToMany(type => Address, address => address.member)
  @JoinColumn()
  public addresses: Address[];

  public static create(createPersonRequest: CreatePersonRequestDto): Member {
    
    const member: Member = new Member();
    member.person = Person.create(createPersonRequest);

    return member;

  }

}