import { PersonStatus } from './../../common/model/entity/users/person';
import { CreditCardDTO, MobileDeviceDTO } from '../../common/model/dto/member';
import {
  Path, GET, POST,
  HttpError, Errors, PathParam, Return, QueryParam, ContextRequest 
} from "typescript-rest";
import {
  MemberRegistrationDTO,MemberInfoDTO
} from "../../common/model/dto/member";
import { Controller, Authenticated } from "../../common/controller";
import { HTTPUtils } from "../../common/utils/http-utils";
import { JSONSerialization } from "../../common/utils/json-serialization";
import { Member } from "../../common/model/entity/users/member";
import { Request } from 'express';
import { PersonRepository } from '../../common/repositories/person-repository';
import { MemberRepository } from '../../common/repositories/member-repository';
import { AuthPrivilege } from '../../common/repositories/auth-repository';
import { getConnection } from 'typeorm';

@Path('/api/v1/member/')
export class MemberController extends Controller {

  private _memberRepository: MemberRepository = new MemberRepository(getConnection());
  private _personRepository: PersonRepository = new PersonRepository(getConnection());

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