import {Entity, JoinColumn, OneToMany, Column} from "typeorm";
import {Person} from "../person";
import {User} from "..";
import {Address} from "../../common/address";
import { CreatePersonRequestDto } from "../../../dto";
import { PaymentAccount } from "../../payment/payment-account";


@Entity()
export class Member extends User {

  @OneToMany(type => Address, address => address.member)
  @JoinColumn()
  public addresses: Address[];

  @OneToMany(type => PaymentAccount, paymentAccount => paymentAccount.member)
  @JoinColumn()
  public paymentAccounts: PaymentAccount[];

  @Column({ unique: true, nullable: true })
  public stripeCustomerId?: string;

  public static create(createPersonRequest: CreatePersonRequestDto, stripeCustomerId?: string): Member {
    
    let member: Member = new Member();
    member.person = Person.create(createPersonRequest);
    if (stripeCustomerId) {
      member.stripeCustomerId = stripeCustomerId;
    }

    return member;

  }

}