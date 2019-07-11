import { BaseController } from "../../common/controller/base-controller";
import { Path, POST, GET, PathParam } from "typescript-rest";
import { Authenticate, JSONEndpoint } from "../../common/annotations";
import { SigningCategory } from "../../services/crypto";
import { Tags, Produces, Security } from "typescript-rest-swagger";
import { CreatePersonRequestDto as CreatePersonRequestDto, MemberInfoDto, AddressDto } from "../../common/model/dto";
import { RepositoryFactory } from "../../common/repository/factory";
import { IMemberRepository } from "../../common/repository";
import { PaymentAccountDto } from "../../common/model/dto/payment/payment-account";
import { exception } from "../../common/errors";


@Produces("application/json")
@Tags("Members")
@Path("/member")
export class MemberController extends BaseController {

  private _memberRepository: IMemberRepository = RepositoryFactory.instance.memberRepository;

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.ADMIN)
  @GET
  public async getAllMembers(): Promise<MemberInfoDto[]> {
    let members = await this._memberRepository.getAllMembers();
    return members.map(memberEntity => new MemberInfoDto({
      id: memberEntity.id,
      firstName: memberEntity.person.firstName,
      lastName: memberEntity.person.lastName,
      created: memberEntity.person.created,
      email: memberEntity.person.email,
      phone: memberEntity.person.phone,
      addresses: memberEntity.addresses.map(a => new AddressDto(a)),
      paymentAccounts: memberEntity.paymentAccounts.map(pa => new PaymentAccountDto(pa))
    }));
  }

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.ADMIN)
  @Path(":id")
  @GET
  public async getMember(@PathParam("id") id: number): Promise<MemberInfoDto> {
    let member = await this._memberRepository.getMemberById(id);
    if (!member) {
      throw new exception.MemberNotFoundException(id);
    }
    return new MemberInfoDto({
      id: member.id,
      firstName: member.person.firstName,
      lastName: member.person.lastName,
      created: member.person.created,
      email: member.person.email,
      phone: member.person.phone,
      addresses: member.addresses.map(a => new AddressDto(a)),
      paymentAccounts: member.paymentAccounts.map(pa => new PaymentAccountDto(pa))
    });
  }

}