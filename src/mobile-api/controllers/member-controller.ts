import {GET, PATCH, Path, PathParam, POST, Accept} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {SigningCategory, AuthCredentialsDto, crypto} from "../../services/crypto";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { MemberMailSender } from "../../common/mail-senders/member-mail-sender";
import {Security, Produces, Tags} from "typescript-rest-swagger";
import { MemberInfoDto, CreatePersonRequestDto, AddressDto, UpdatePersonInfoRequestDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member";
import { IPersonRepository } from "../../common/repository/person-repository";
import { RepositoryFactory } from "../../common/repository/factory";
import { IMemberRepository } from "../../common/repository/member-repository";
import { PaymentAccountDto } from "../../common/model/dto/payment/payment-account";
import { IMemberManager } from "../../common/manager/member";
import { ManagerFactory } from "../../common/manager";


@Produces("application/json")
@Tags("Members")
@Accept("application/json")
@Path('/member')
export class MemberController extends BaseController {

  private _memberRepository: IMemberRepository = RepositoryFactory.instance.memberRepository;
	private _personRepository: IPersonRepository = RepositoryFactory.instance.personRepository;
	private _memberManager: IMemberManager = ManagerFactory.instance.memberManager;

	@Security("Bearer")
	@JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
	public async getMemberInfo(): Promise<MemberInfoDto> {

		let memberEntity = <Member>this.pendingUser;

		return new MemberInfoDto({
			id: memberEntity.id,
			firstName: memberEntity.person.firstName,
			lastName: memberEntity.person.lastName,
			created: memberEntity.person.created,
			email: memberEntity.person.email,
			phone: memberEntity.person.phone,
			addresses: memberEntity.addresses.map(a => new AddressDto(a)),
			paymentAccounts: memberEntity.paymentAccounts.map(pa => new PaymentAccountDto(pa))
		});

  }

	@JSONEndpoint
  @POST
  public async createMember(@JSONBody(CreatePersonRequestDto) request: CreatePersonRequestDto): Promise<AuthCredentialsDto> {

		let member = await this._memberManager.createMember(request);
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
  public async updateMemberInfo(@JSONBody(UpdatePersonInfoRequestDto) request: UpdatePersonInfoRequestDto) {
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