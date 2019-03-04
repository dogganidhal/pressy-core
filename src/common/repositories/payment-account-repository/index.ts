import { Member } from "common/model/entity/users/member";
import { PaymentAccountDto } from "common/model/dto/payment/payment-account";
import { CreatePaymentAccountDto } from "common/model/dto/payment/create-payment-account";
import { PaymentAccount } from "common/model/entity/payment/payment-account";


export interface IPaymentAccountRepository {

  getMemberPaymentAccounts(member: Member): Promise<Array<PaymentAccount>>;
  createMemberPaymentAccount(member: Member, request: CreatePaymentAccountDto): Promise<PaymentAccount>;
  deletePaymentAccount(paymentAccountId: string, member: Member): Promise<void>;

}