import { IPaymentAccountRepository } from ".";
import { Member } from "../../../common/model/entity/users/member";
import { CreatePaymentAccountDto } from "../../../common/model/dto/payment/create-payment-account";
import { BaseRepository } from "../base-repository";
import { Repository } from "typeorm";
import { PaymentAccount } from "../../../common/model/entity/payment/payment-account";
import { exception } from "../../../common/errors";


export class PaymentAccountRepositoryImpl extends BaseRepository implements IPaymentAccountRepository {

  private _repository: Repository<PaymentAccount> = this.connection.getRepository(PaymentAccount);
  
  public async getMemberPaymentAccounts(member: Member): Promise<PaymentAccount[]> {
    return await this._repository.find({member: member});
  }  

  public async createMemberPaymentAccount(account: PaymentAccount): Promise<PaymentAccount> {
    return await this._repository.save(account);
  }
  
  public async deletePaymentAccount(paymentAccountId: string, member: Member): Promise<void> {
    let paymentAccountOwner = await this._repository.findOne({id: paymentAccountId});
    if (!paymentAccountOwner || paymentAccountOwner.member.id != member.id) {
      throw new exception.PaymentAccountNotFoundException(paymentAccountId);
    }
    await this._repository.delete({id: paymentAccountId});
  }

  public async getPaymentAccountByToken(token: string): Promise<PaymentAccount | undefined> {
    return await this._repository.findOne({ stripeCustomerId: token });
  }

  public async getPaymentAccountById(id: string): Promise<PaymentAccount | undefined> {
    return await this._repository.findOne({id: id}, {relations: ["member"]});
  }

}