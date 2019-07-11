import { Member } from "../../model/entity/users/member";
import { CreatePaymentAccountDto } from "../../model/dto/payment/create-payment-account";
import { PaymentAccount } from "../../model/entity/payment/payment-account";


export interface IPaymentManager {
  addPaymentAccountForMember(member: Member, request: CreatePaymentAccountDto): Promise<PaymentAccount>;
}