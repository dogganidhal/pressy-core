
export interface IPaymentAccount {
  id: string;
  cardAlias: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}

export class PaymentAccountDto {

  public id: string;
  public cardAlias: string;
  public holderName: string;
  public expiryMonth: number;
  public expiryYear: number;
  public cvc: string;

  constructor(account: IPaymentAccount) {
    this.id = account.id;
    this.cardAlias = account.cardAlias;
    this.holderName = account.holderName;
    this.cvc = account.cvc;
    this.expiryMonth = account.expiryMonth;
    this.expiryYear = account.expiryYear;
  }

}