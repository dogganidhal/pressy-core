import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Member } from "../users/member";
import { ICreatePaymentAccount } from "../../../../common/model/dto/payment/create-payment-account";


@Entity()
export class PaymentAccount {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @JoinColumn()
  @ManyToOne(type => Member)
  public member: Member;

  @Column({unique: true, nullable: false})
  public stripeCustomerId: string;

  @Column({nullable: false})
  public cardAlias: string;

  @Column({nullable: false})
  public holderName: string;

  @Column({nullable: false})
  public expiryMonth: number;

  @Column({nullable: false})
  public expiryYear: number;

  @Column({nullable: false})
  public cvc: string;

  public static create(member: Member, account: ICreatePaymentAccount): PaymentAccount {
    let paymentAccount = new PaymentAccount();

    paymentAccount.member = member;
    paymentAccount.expiryYear = account.expiryYear;
    paymentAccount.expiryMonth = account.expiryMonth;
    paymentAccount.cardAlias = account.cardAlias;
    paymentAccount.stripeCustomerId = account.stripeCustomerId;
    paymentAccount.cvc = account.cvc;
    paymentAccount.holderName = account.holderName;

    return paymentAccount;
  }

}