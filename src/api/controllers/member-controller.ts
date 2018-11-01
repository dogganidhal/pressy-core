import { PersonStatus } from '../../common/model/entity/users/person';
import {  MobileDeviceDTO } from '../../common/model/dto/member';
import {Path, GET, POST,PathParam, Return, QueryParam} from "typescript-rest";
import {
  MemberRegistrationDTO,MemberInfoDTO
} from "../../common/model/dto/member";
import { Member } from "../../common/model/entity/users/member";
import { PersonRepository } from '../../common/repositories/person-repository';
import { MemberRepository } from '../../common/repositories/member-repository';
import { AuthPrivilege } from '../../common/repositories/auth-repository';
import { getConnection } from 'typeorm';
import {BaseController} from "./base-controller";
import {Authenticate, JSONResponse} from "../annotations";

@Path('/api/v1/member/')
export class MemberController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(getConnection());
  private _personRepository: PersonRepository = new PersonRepository(getConnection());

  @JSONResponse
  @Authenticate(AuthPrivilege.SUPERUSER)
  @Path("/all")
  @GET
  public async getAllMembers(@QueryParam("g") group?: number, @QueryParam("q") query?: string) {

    console.log({group: group, query: query});
    const members: Member[] = await this._memberRepository.getAllMembers();
    return members.map(member => MemberInfoDTO.create(member));

  }

	@JSONResponse
  @Authenticate(AuthPrivilege.BASIC)
  @GET
  public async getMemberInfo() {

    const member = this.pendingMember;

    if (member)
      return MemberInfoDTO.create(member);

  }

  @JSONResponse
  @POST
  public async createMember() {

	  const newMember: MemberRegistrationDTO = JSON.parse(this.getPendingRequest().body) as MemberRegistrationDTO;
	  const member = await this._memberRepository.createMember(newMember);
	  const personActivationCode = await this._personRepository.createActivationCode(member.person);
	  // TODO: Send the activation URL by email !!
	  return newMember;

  }

  @JSONResponse
  @Path("/activate/:code/")
  @GET
  public async activateMember(@PathParam("code") code: string) {

	  const person = await this._personRepository.getActivationCodePerson(code);
	  person.status = PersonStatus.ACTIVE;

	  await this._personRepository.savePerson(person);
	  await this._personRepository.deleteActivationCode(code);

	  return new Return.RequestAccepted(`/api/v1/member/`);

  }

  @JSONResponse
  @Authenticate(AuthPrivilege.BASIC)
  @Path("/devices/")
  @POST
  public async registerMobileDevice() {

    const member = this.pendingMember!;
    const mobileDeviceDTO = this.getPendingRequest().body as MobileDeviceDTO;
    
    await this._memberRepository.registerMobileDevice(member, mobileDeviceDTO);

    return new Return.NewResource(`/api/v1/member/devices`);

  }

  @JSONResponse
  @Authenticate(AuthPrivilege.BASIC)
  @Path("/devices/")
  @GET
  public async getMobileDevices() {

    const member = this.pendingMember!;
    
    return (await this._memberRepository.getMobileDevices(member))
    .map(device => MobileDeviceDTO.create(device.id));

  }

}