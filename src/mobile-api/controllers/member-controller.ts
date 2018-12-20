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
import {Security, Produces, Tags, Response} from "typescript-rest-swagger";
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
		let emailValidationCode = await this._personRepository.createEmailValidationCode(member.person);

		new MemberMailSender().sendActivationCode(member, emailValidationCode.code);
		// TODO: Implement SMS Sender => Send Validation Code with SMS
		let _ = await this._personRepository.createPhoneValidationCode(member.person);

		return crypto.signAuthToken(member, SigningCategory.MEMBER);

	}

	@Security("Bearer")
	@JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberInfo(@JSONBody(UpdatePersonInfoRequest) request: UpdatePersonInfoRequest) {
		await this._personRepository.updatePersonInfo(this.pendingUser.person, request);
  }

	@JSONEndpoint
	@Path("/validate-email/:code")
	@GET
	public async validateEmail(@PathParam("code") code: string) {
		await this._personRepository.validateEmail(code);
	}

	@JSONEndpoint
	@Path("/validate-phone/:code")
	@GET
	public async validatePhone(@PathParam("code") code: string) {
		await this._personRepository.validatePhone(code);
	}

}