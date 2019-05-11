import { IPaymentManager } from ".";
import { Member } from "../../model/entity/users/member";
import { CreatePaymentAccountDto } from "../../model/dto/payment/create-payment-account";
import { PaymentAccount } from "../../model/entity/payment/payment-account";
import Stripe from "stripe";
import { getConfig } from "../../../config";
import { IPaymentAccountRepository } from "../../repository/payment-account-repository";
import { RepositoryFactory } from "../../repository/factory";
import { exception } from "../../errors";



export class PaymentManagerImpl implements IPaymentManager {

  private _paymentRepository: IPaymentAccountRepository = RepositoryFactory.instance.paymentAccountRepository;

  public async addPaymentAccountForMember(member: Member, request: CreatePaymentAccountDto): Promise<PaymentAccount> {

    let existingPaymentAccount = await this._paymentRepository.getPaymentAccountByToken(request.cardToken);
    if (existingPaymentAccount) 
      throw new exception.PaymentAccountAlreadyExists(request.cardToken);

    let stripeCustomer = await this.createStripeCustomer(member, request.cardToken);
    let paymentAccount = PaymentAccount.create(member, {
      ...request,
      stripeCustomerId: stripeCustomer.id
    });
    return await this._paymentRepository.createMemberPaymentAccount(paymentAccount);

  }

  private async createStripeCustomer(member: Member, cardToken: string): Promise<Stripe.customers.ICustomer> {

    let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "production"].apiKey
    let stripe = new Stripe(stripeApiKey);
    let fullName = `${member.person.firstName} ${member.person.lastName}`;
    return await stripe.customers.create({ 
      email: member.person.email, 
      description: fullName,
      source: cardToken
    });
    
  }

}