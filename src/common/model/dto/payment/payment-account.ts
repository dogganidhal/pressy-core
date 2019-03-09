
export interface IPaymentAccount {
  cardAlias: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}

export class PaymentAccountDto {

  public cardAlias: string;
  public holderName: string;
  public expiryMonth: number;
  public expiryYear: number;
  public cvc: string;

  constructor(account: IPaymentAccount) {
    this.cardAlias = account.cardAlias;
    this.holderName = account.holderName;
    this.cvc = account.cvc;
    this.expiryMonth = account.expiryMonth;
    this.expiryYear = account.expiryYear;
  }

}