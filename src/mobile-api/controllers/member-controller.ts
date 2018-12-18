import {GET, PATCH, Path, PathParam, POST, Return, Accept} from "typescript-rest";
import {PersonRepository} from '../../common/repositories/users/person-repository';
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory, AuthCredentials, crypto} from "../../services/crypto";
import {exception} from "../../common/errors";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {GeocodeService} from "../../services/geocode-service";
import { MemberMailSender } from "../../common/mail-senders/member-mail-sender";
import { InternalServerError } from "typescript-rest/dist/server-errors";
import { Security, Produces, Tags } from "typescript-rest-swagger";
import { MemberInfo, CreatePersonRequest, Address as AddressDTO, MobileDevice, CreateAddressRequest, UpdatePersonInfoRequest } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member/member";

@Produces("application/json")
@Tags("Members")
@Accept("application/json")
@Path('/member')
export class MemberController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

	@Security("Bearer")
	@JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
	public async getMemberInfo(): Promise<MemberInfo> {

		let memberEntity = <Member>this.pendingUser;

		return new MemberInfo({
			id: memberEntity.id,
			firstName: memberEntity.person.firstName,
			lastName: memberEntity.person.lastName,
			created: memberEntity.person.created,
			email: memberEntity.person.email,
			phone: memberEntity.person.phone,
			addresses: memberEntity.addresses.map(a => new AddressDTO(a))
		});

  }

	@JSONEndpoint
  @POST
  public async createMember(@JSONBody(CreatePersonRequest) request: CreatePersonRequest): Promise<AuthCredentials> {

	  let member = await this._memberRepository.createMember(request);
	  let personActivationCode = await this._personRepository.createActivationCode(member.person);
		let memberMailSender = new MemberMailSender;

		memberMailSender.sendActivationCode(member, personActivationCode.code);

		return crypto.signAuthToken(member, SigningCategory.MEMBER);

  }

  @JSONEndpoint
  @Path("/activate/:code")
  @GET
  public async activateMember(@PathParam("code") code: string) {

		await this._personRepository.activatePerson(code);
		return new Return.RequestAccepted("/v1/member");

  }

	@Security("Bearer")
	@JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberInfo(@JSONBody(UpdatePersonInfoRequest) request: UpdatePersonInfoRequest) {

		await this._personRepository.updatePersonInfo(this.pendingUser.person, request);
		return new Return.RequestAccepted("/v1/member");

  }

}