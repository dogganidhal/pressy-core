import {PersonStatus} from '../../common/model/entity/users/person';
import {GET, PATCH, Path, PathParam, POST, Return} from "typescript-rest";
import {PersonRepository} from '../../common/repositories/users/person-repository';
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";
import {exception} from "../../common/errors";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {GeocodeService} from "../../common/services/geocode-service";
import {Address} from "../../common/model/entity/common/address";


@Path('/api/v1/member/')
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

	  const newMember = http.parseJSONBody(this.getPendingRequest().body, DTO.person.CreatePersonRequest);
	  const member = await this._memberRepository.createMember(newMember);
	  const personActivationCode = await this._personRepository.createActivationCode(member.person);
	  // TODO: Send the activation URL by email !!
	  return new Return.NewResource("/api/v1/member/info");

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

  @Authenticate(crypto.SigningCategory.MEMBER)
  @Path("/devices")
  @POST
  public async registerMobileDevice() {

    const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
    	throw new exception.AccountNotFoundException(this.pendingPerson.email);

    const mobileDevice = http.parseJSONBody(this.getPendingRequest().body, DTO.person.MobileDevice);
    
    await this._memberRepository.registerMobileDevice(member, mobileDevice);

    return new Return.NewResource(`/api/v1/member/devices`);

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

  @Authenticate(crypto.SigningCategory.MEMBER)
  @PATCH
  @Path("/info")
  public async updateMemberInfo() {

  	let person = this.pendingPerson;
  	let updateRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.UpdatePersonInfoRequest);
  	await this._personRepository.updatePersonInfo(person, updateRequest);

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

		return new Return.NewResource("/api/v1/member/info");

  }

}