import uuid from 'uuid';
import { CreditCardDTO } from './../../dto/index';
import { Member } from './member';
import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class PaymentAccount {

  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => Member)
  @JoinColumn()
  public member: Member;
  
  @Column({unique: true})
  public creditCardNumber: string;

  @Column({nullable: false})
  public creditCardOwnerName: string;

  @Column({nullable: false})
  public creditExpiryDate: Date;

  public static create(member: Member, creditCardDTO: CreditCardDTO): PaymentAccount {
    const paymentAccount = new PaymentAccount();

    paymentAccount.id = uuid.v4().toString();
    paymentAccount.member = member;
    paymentAccount.creditCardNumber = creditCardDTO.creditCardNumber;
    paymentAccount.creditCardOwnerName = creditCardDTO.creditCardOwnerName;
    paymentAccount.creditExpiryDate = creditCardDTO.creditCardExpiryDate;

    return paymentAccount;
  }

}