import { PersonStatus } from './../../common/model/entity/users/person';
import { CreditCardDTO, MobileDeviceDTO } from '../../common/model/dto/member';
import {
  Path, GET, POST,
  HttpError, Errors, PathParam, Return, QueryParam, ContextRequest 
} from "typescript-rest";
import { MemberRepository, AuthPrivilege } from "../../common/repositories";
import {
  MemberRegistrationDTO,MemberInfoDTO
} from "../../common/model/dto/member";
import { Controller, Authenticated } from "../../common/controller";
import { HTTPUtils } from "../../common/utils/http-utils";
import { JSONSerialization } from "../../common/utils/json-serialization";
import { Member } from "../../common/model/entity/users/member";
import { Exception } from '../../common/errors';
import { DateUtils } from '../../common/utils';
import { Request } from 'express';
import { PersonRepository } from '../../common/repositories/person-repository';

@Path('/api/v1/member/')
export class MemberController extends Controller {

  private _memberRepository: MemberRepository = MemberRepository.instance;
  private _personRepository: PersonRepository = PersonRepository.instance;

  @Authenticated(AuthPrivilege.SUPERUSER)
  @Path("/all")
  @GET
  public async getAllMembers(@QueryParam("g") group?: number, @QueryParam("q") query?: string) {
    console.log({group: group, query: query});
    const members: Member[] = await this._memberRepository.getAllMembers();
    return members.map(member => JSONSerialization.serializeObject(MemberInfoDTO.create(member)));
  }

  @Authenticated(AuthPrivilege.BASIC)
  @GET
  public async getMemberInfos() {
    const member = this.currentMember;
    return JSONSerialization.serializeObject(MemberInfoDTO.create(member!));
  }

  @POST
  public async createMember(@ContextRequest request: Request) {

    try {
      const newMember: MemberRegistrationDTO = HTTPUtils.parseBody(request.body, MemberRegistrationDTO);
      const member = await this._memberRepository.createMember(newMember);
      const _ = this._personRepository.createActivationCode(member.person);
      // TODO: Send the activation URL by email !!
      return JSONSerialization.serializeObject(newMember);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/activate/:code/")
  @GET
  public async activateMember(@PathParam("code") code: string) {

    try {
      const person = await this._personRepository.getActivationCodePerson(code);
      person.status = PersonStatus.ACTIVE;

      await this._personRepository.savePerson(person);
      await this._personRepository.deleteActivationCode(code);

      return new Return.RequestAccepted(`/api/v1/member/`);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Authenticated(AuthPrivilege.BASIC)
  @Path("/payment-accounts/")
  @GET
  public async getPaymentAccounts() {

    return (await this._memberRepository.getPaymentAccounts(this.currentMember!))
      .map(paymentAccount => JSONSerialization.serializeObject(CreditCardDTO.create(paymentAccount)));

  }

  @Authenticated(AuthPrivilege.BASIC)
  @Path("/payment-accounts/")
  @POST
  public async addPaymentAccount(@ContextRequest request: Request) {

    const creditCardExpiryDate: string = JSON.parse(request.body)["credit_card_expiry_date"];

    if (!creditCardExpiryDate) {
      this.throw(new Exception.RequiredFieldNotFound);
      return;
    }

    try {
      DateUtils.checkCreditCardExpiryDate(creditCardExpiryDate);
    } catch(error) {
      this.throw(new Exception.InvalidCreditCardInformation(error.message));
      return;
    }

    try {

      const creditCard: CreditCardDTO = HTTPUtils.parseBodyOfContoller(this, CreditCardDTO);
      await this._memberRepository.addPaymentAccount(this.currentMember!, creditCard);
      return new Return.NewResource(`/api/v1/member/payment-accounts`);

    } catch (error) {
      this.throw(error);
    }

  }

  @Authenticated(AuthPrivilege.BASIC)
  @Path("/devices/")
  @POST
  public async registerMobileDevice(@ContextRequest request: Request) {

    const member = this.currentMember!;
    const mobileDeviceDTO = HTTPUtils.parseBody(request.body, MobileDeviceDTO);
    
    await this._memberRepository.registerMobileDevice(member, mobileDeviceDTO);

    return new Return.NewResource(`/api/v1/member/devices`);

  }

  @Authenticated(AuthPrivilege.BASIC)
  @Path("/devices/")
  @GET
  public async getMobileDevices() {

    const member = this.currentMember!;
    
    return (await this._memberRepository.getMobileDevices(member))
    .map(device => JSONSerialization.serializeObject(MobileDeviceDTO.create(device.id)))

  }

}