import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Person, PersonStatus} from "../person";
import {IUser} from "..";
import {Address} from "../../common/address";
import { CreatePersonRequest } from "../../../dto";

@Entity()
export class Member implements IUser {

  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Person)
  @JoinColumn()
  public person: Person;

  @OneToMany(type => Address, address => address.member)
  @JoinColumn()
  public addresses: Address[];

	public isActive(): boolean {
		return this.person.status === PersonStatus.ACTIVE;
	}

  public static create(createPersonRequest: CreatePersonRequest): Member {
    
    const member: Member = new Member();
    member.person = Person.create(createPersonRequest);

    return member;

  }

}