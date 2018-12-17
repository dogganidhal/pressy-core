import {GET, PATCH, Path, PathParam, POST, Return, Accept} from "typescript-rest";
import {PersonRepository} from '../../common/repositories/users/person-repository';
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory, AuthCredentials, crypto} from "../../services/crypto";
import {exception} from "../../common/errors";
import {http} from "../../common/utils/http";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {GeocodeService} from "../../services/geocode-service";
import { MemberMailSender } from "../../common/mail-senders/member-mail-sender";
import { InternalServerError } from "typescript-rest/dist/server-errors";
import { Security, Produces, Tags } from "typescript-rest-swagger";
import { MemberInfo, CreatePersonRequest, Address as AddressDTO, MobileDevice, CreateAddressRequest, UpdatePersonInfoRequest } from "../../common/model/dto";

@Produces("application/json")
@Tags("Member")
@Accept("application/json")
@Path('/member')
export class MemberController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

	@Security("Bearer")
	@JSONResponse
  @Authenticate(SigningCategory.MEMBER)
  @GET
	public async getMemberInfo(): Promise<MemberInfo> {

		let memberEntity = await this._memberRepository.getMemberFromPerson(this.pendingPerson);
		
		if (!memberEntity)
			throw new InternalServerError;

		return new MemberInfo({
			id: memberEntity.id,
			firstName: memberEntity.person.firstName,
			lastName: memberEntity.person.lastName,
			created: memberEntity.person.created,
			email: memberEntity.person.email,
			phone: memberEntity.person.phone,
			addresses: memberEntity.addresses.map(a => new AddressDTO({
				id: a.id, streetName: a.streetName, streetNumber: a.streetNumber,
				zipCode: a.zipCode, city: a.city, country: a.country, formattedAddress: a.formattedAddress
			}))
		});

  }

	@JSONResponse
  @POST
  public async createMember(test: CreatePersonRequest): Promise<AuthCredentials> {

	  let newMember = http.parseJSONBody(this.getPendingRequest().body, CreatePersonRequest);
	  let member = await this._memberRepository.createMember(newMember);
	  let personActivationCode = await this._personRepository.createActivationCode(member.person);
		let memberMailSender = new MemberMailSender;

		memberMailSender.sendActivationCode(member, personActivationCode.code);

		return crypto.signAuthToken(member.person, SigningCategory.MEMBER);

  }

  @Path("/activate/:code")
  @GET
  public async activateMember(@PathParam("code") code: string) {

		await this._personRepository.activatePerson(code);
		
		return new Return.RequestAccepted("/v1/member");

  }

	@Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @Path("/devices")
  @POST
  public async registerMobileDevice() {

    const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
    	throw new exception.AccountNotFoundException(this.pendingPerson.email);

    const mobileDevice = http.parseJSONBody(this.getPendingRequest().body, MobileDevice);
    
    await this._memberRepository.registerMobileDevice(member, mobileDevice);

    return new Return.NewResource(`/v1/member/devices`);

  }

	@Security("Bearer")
  @JSONResponse
  @Authenticate(SigningCategory.MEMBER)
  @Path("/devices")
  @GET
  public async getMobileDevices(): Promise<MobileDevice[]> {

	  const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

	  if (!member)
		  throw new exception.AccountNotFoundException(this.pendingPerson.email);

	  let mobileDevices = await this._memberRepository.getMobileDevices(member);

    return mobileDevices.map(device => {
			return {deviceId: device.id};
		});

  }

	@Security("Bearer")
	@JSONResponse
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberInfo(request: UpdatePersonInfoRequest) {

  	let updateRequest = http.parseJSONBody(this.getPendingRequest().body, UpdatePersonInfoRequest);
		await this._personRepository.updatePersonInfo(this.pendingPerson, updateRequest);
		
		return new Return.RequestAccepted("/v1/member");

  }

}