import {GET, PATCH, Path, PathParam, POST, Return} from "typescript-rest";
import {PersonRepository} from '../../common/repositories/users/person-repository';
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../services/crypto";
import {exception} from "../../common/errors";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {GeocodeService} from "../../services/geocode-service";
import {Address} from "../../common/model/entity/common/address";
import { MemberMailSender } from "../../common/mail-senders/member-mail-sender";


@Path('/v1/member/')
export class MemberController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());
  private _geocodeService: GeocodeService = new GeocodeService();

	@JSONResponse
  @Authenticate(crypto.SigningCategory.MEMBER)
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
	      phone: member.person.phone,
	      addresses: member.addresses.map(a => new DTO.address.Address({
		      streetName: a.streetName, streetNumber: a.streetNumber,
		      zipCode: a.zipCode, city: a.city, country: a.country, formattedAddress: a.formattedAddress
	      }))
      });

  }

	@JSONResponse
  @POST
  public async createMember() {

	  let newMember = http.parseJSONBody(this.getPendingRequest().body, DTO.person.CreatePersonRequest);
	  let member = await this._memberRepository.createMember(newMember);
	  let personActivationCode = await this._personRepository.createActivationCode(member.person);
		let memberMailSender = new MemberMailSender;

		memberMailSender.sendActivationCode(member, personActivationCode.code);

		return new Return.NewResource(`/v1/member`);

  }

  @Path("/activate/:code/")
  @GET
  public async activateMember(@PathParam("code") code: string) {

		await this._personRepository.activatePerson(code);
		
		return new Return.RequestAccepted("/v1/member");

  }

  @Authenticate(crypto.SigningCategory.MEMBER)
  @Path("/devices")
  @POST
  public async registerMobileDevice() {

    const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
    	throw new exception.AccountNotFoundException(this.pendingPerson.email);

    const mobileDevice = http.parseJSONBody(this.getPendingRequest().body, DTO.person.MobileDevice);
    
    await this._memberRepository.registerMobileDevice(member, mobileDevice);

    return new Return.NewResource(`/v1/member/devices`);

  }

  @JSONResponse
  @Authenticate(crypto.SigningCategory.MEMBER)
  @Path("/devices")
  @GET
  public async getMobileDevices() {

	  const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

	  if (!member)
		  throw new exception.AccountNotFoundException(this.pendingPerson.email);

	  let mobileDevices = await this._memberRepository.getMobileDevices(member);

    return mobileDevices.map(device => ({deviceId: device.id}));

  }

	@JSONResponse
  @Authenticate(crypto.SigningCategory.MEMBER)
  @PATCH
  public async updateMemberInfo() {

  	let person = this.pendingPerson;
  	let updateRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.UpdatePersonInfoRequest);
		await this._personRepository.updatePersonInfo(person, updateRequest);
		
		return new Return.RequestAccepted("/v1/member");

  }

  @Authenticate(crypto.SigningCategory.MEMBER)
  @PATCH
  @Path("/addresses")
	public async setMemberAddresses() {

		let addresses = http.parseJSONArrayBody(this.getPendingRequest().body, DTO.address.CreateAddressRequest);
		let member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

		if (!member)
			throw new exception.CannotFindMemberException(this.pendingPerson.email);

		let addressEntities: Address[] = [];

		for (let createAddressRequest of addresses) {

			if (createAddressRequest.googlePlaceId) {
				let addressDTO = await this._geocodeService.getAddressWithPlaceId(createAddressRequest.googlePlaceId);
				addressEntities.push(Address.create(addressDTO));
				continue;
			}

			if (!createAddressRequest.coordinates)
				throw new exception.CannotCreateAddressException;

			let addressDTO = await this._geocodeService.getAddressWithCoordinates(createAddressRequest.coordinates);
			addressEntities.push(Address.create(addressDTO));

		}

		await this._memberRepository.setMemberAddresses(member, addressEntities);

		return new Return.NewResource("/v1/member");

  }

}