import { Member } from "../../../common/model/entity/users/member";
import { PaymentAccount } from "../../../common/model/entity/payment/payment-account";


export interface IPaymentAccountRepository {

  getMemberPaymentAccounts(member: Member): Promise<Array<PaymentAccount>>;
  getPaymentAccountByToken(token: string): Promise<PaymentAccount | undefined>;
  createMemberPaymentAccount(account: PaymentAccount): Promise<PaymentAccount>;
  deletePaymentAccount(paymentAccountId: string, member: Member): Promise<void>;

}