import { IMemberManager } from ".";
import { CreatePersonRequestDto } from "../../model/dto";
import { Member } from "../../model/entity/users/member";
import { exception } from "../../errors";
import { validation } from "../../utils";
import { IMemberRepository } from "../../repository";
import { RepositoryFactory } from "../../repository/factory";
import { getConfig } from "../../../config";
import Stripe from "stripe";


export class MemberManagerImpl implements IMemberManager {

  private _memberRepository: IMemberRepository = RepositoryFactory.instance.memberRepository;

  public async createMember(createMemberRequest: CreatePersonRequestDto): Promise<Member> {

    const { email, phone, password } = createMemberRequest;

    if (!email)
      throw new exception.MissingFieldsException("email");

    if (!phone)
      throw new exception.MissingFieldsException("phone");

    if (!validation.validateEmail(email))
      throw new exception.InvalidEmailException(email);

    if (!validation.validatePhoneNumber(phone))
      throw new exception.InvalidPhoneException(phone);

    let invalidPasswordReason = validation.validatePassword(password);
    if (invalidPasswordReason != null)
      throw new exception.InvalidPasswordException(invalidPasswordReason);

    const memberWithSameEmail = await this._memberRepository.getMemberByEmail(email);
    if (memberWithSameEmail)
      throw new exception.EmailAlreadyExistsException(email);

    const memberWithSamePhone = await this._memberRepository.getMemberByPhone(phone);
    if (memberWithSamePhone)
      throw new exception.PhoneAlreadyExists(phone);

    let stripeCustomer = await this.createStripeCustomer(email, `${createMemberRequest.firstName} ${createMemberRequest.lastName}`);
    let member = this._memberRepository.insertMember(Member.create(createMemberRequest, stripeCustomer.id));

    return member;
    
  }

  private createStripeCustomer(email: string, fullName: string): Promise<Stripe.customers.ICustomer> {
    let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "production"].apiKey
    let stripe = new Stripe(stripeApiKey);
    return stripe.customers.create({email: email, description: fullName});
  }

}