import {PersonStatus} from '../../common/model/entity/users/person';
import {GET, Path, PathParam, POST, QueryParam, Return} from "typescript-rest";
import {Member} from "../../common/model/entity/users/member";
import {PersonRepository} from '../../common/repositories/person-repository';
import {MemberRepository} from '../../common/repositories/member-repository';
import {BaseController} from "./base-controller";
import {Authenticate, JSONResponse} from "../annotations";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";
import {exception} from "../../common/errors";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";


@Path('/api/v1/person/')
export class MemberController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @JSONResponse
  @Authenticate(crypto.SigningCategory.ADMIN)
  @Path("/all")
  @GET
  public async getAllMembers(@QueryParam("g") group?: number, @QueryParam("q") query?: string) {

    console.log({group: group, query: query});
    const members: Member[] = await this._memberRepository.getAllMembers();
    return members.map(member => new DTO.member.MemberInfo({
      id: member.id,
      firstName: member.person.firstName,
      lastName: member.person.lastName,
      created: member.person.created,
      email: member.person.email,
      phone: member.person.phone
    }));

  }

	@JSONResponse
  @Authenticate([crypto.SigningCategory.ADMIN, crypto.SigningCategory.MEMBER])
  @GET
  public async getMemberInfo() {

  	let member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (member)
      return new DTO.member.MemberInfo({
	      id: member.id,
	      firstName: member.person.firstName,
	      lastName: member.person.lastName,
	      created: member.person.created,
	      email: member.person.email,
	      phone: member.person.phone
      });

  }

  @JSONResponse
  @POST
  public async createMember() {

	  const newMember = http.parseJSONBody(this.getPendingRequest().body, DTO.member.CreateMemberRequest);
	  const member = await this._memberRepository.createMember(newMember);
	  const personActivationCode = await this._personRepository.createActivationCode(member.person);
	  // TODO: Send the activation URL by email !!
	  return newMember;

  }

  @Path("/activate/:code/")
  @GET
  public async activateMember(@PathParam("code") code: string) {

	  const person = await this._personRepository.getActivationCodePerson(code);
	  person.status = PersonStatus.ACTIVE;

	  await this._personRepository.savePerson(person);
	  await this._personRepository.deleteActivationCode(code);

	  return new Return.RequestAccepted(`/api/v1/member/`);

  }

  @Authenticate([crypto.SigningCategory.ADMIN, crypto.SigningCategory.MEMBER])
  @Path("/devices/")
  @POST
  public async registerMobileDevice() {

    const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
    	throw new exception.MemberNotFoundException(this.pendingPerson.email);

    const mobileDevice = this.getPendingRequest().body as DTO.member.MobileDevice;
    
    await this._memberRepository.registerMobileDevice(member, mobileDevice);

    return new Return.NewResource(`/api/v1/member/devices`);

  }

  @JSONResponse
  @Authenticate([crypto.SigningCategory.ADMIN, crypto.SigningCategory.MEMBER])
  @Path("/devices/")
  @GET
  public async getMobileDevices() {

	  const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

	  if (!member)
		  throw new exception.MemberNotFoundException(this.pendingPerson.email);
    
    return (await this._memberRepository.getMobileDevices(member))
    .map(device => ({deviceId: device.id}));

  }

}