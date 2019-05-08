import { IPaymentManager } from ".";
import { Member } from "../../model/entity/users/member";
import { CreatePaymentAccountDto } from "../../model/dto/payment/create-payment-account";
import { PaymentAccount } from "../../model/entity/payment/payment-account";
import { Repository } from "typeorm";
import { Database } from "../../db";
import Stripe from "stripe";
import { getConfig } from "../../../config";
import { IPaymentAccountRepository } from "../../repositories/payment-account-repository";
import { RepositoryFactory } from "../../repositories/factory";
import { exception } from "../../errors";



export class PaymentManagerImpl implements IPaymentManager {

  private _paymentRepository: IPaymentAccountRepository = RepositoryFactory.instance.paymentAccountRepository;

  public async addPaymentAccountForMember(member: Member, request: CreatePaymentAccountDto): Promise<PaymentAccount> {

    let existingPaymentAccount = await this._paymentRepository.getPaymentAccountByToken(request.cardToken);
    if (existingPaymentAccount) 
      throw new exception.PaymentAccountAlreadyExists(request.cardToken);

    let paymentAccount = PaymentAccount.create(member, request);
    paymentAccount = await this._paymentRepository.createMemberPaymentAccount(paymentAccount);

    await this.attributeCardToStripCustomer(member, request.cardToken);
    
    return paymentAccount;

  }

  private async attributeCardToStripCustomer(member: Member, cardToken: string): Promise<void> {

    let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "production"].apiKey
    let stripe = new Stripe(stripeApiKey);
    let stripeCustomerId = member.stripeCustomerId;
    if (!member.stripeCustomerId) {
      let fullName = `${member.person.firstName} ${member.person.lastName}`;
      let stripeCustomer = await stripe.customers.create({ email: member.person.email, description: fullName });
      stripeCustomerId = stripeCustomer.id;
    }
    
    await stripe.customers.createSource(stripeCustomerId!, { source: cardToken });

  }

}