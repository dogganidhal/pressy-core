import { Required } from "../../../../common/annotations";



export interface ICreatePaymentAccount {
  stripeCustomerId: string;
  cardAlias: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}


export class CreatePaymentAccountDto {

  @Required()
  public cardToken: string;

  @Required()
  public cardAlias: string;

  @Required()
  public holderName: string;

  @Required()
  public expiryMonth: number;

  @Required()
  public expiryYear: number;

  @Required()
  public cvc: string;

}