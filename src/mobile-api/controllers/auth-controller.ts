import { Tags, Produces } from "typescript-rest-swagger";
import {Path, PathParam, POST, Return} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {BaseController} from "../../common/controller/base-controller";
import {crypto, SigningCategory, AuthCredentialsDto} from "../../services/crypto";
import {JSONEndpoint} from "../../common/annotations";
import { LoginRequestDto, RefreshCredentialsRequestDto, ResetCodeRequestDto, ResetCodeDto, ResetPasswordRequestDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import { IPersonRepository } from "../../common/repositories/person-repository";
import { RepositoryFactory } from "../../common/repositories/factory";
import { IMemberRepository } from "../../common/repositories/member-repository";


@Produces("application/json")
@Tags("Authentication")
@Path('/auth')
export class AuthController extends BaseController {

  private _memberRepository: IMemberRepository = RepositoryFactory.instance.createMemberRepository();
	private _personRepository: IPersonRepository = RepositoryFactory.instance.createPersonRepository();

  @JSONEndpoint
  @POST
  public async login(@JSONBody(LoginRequestDto) request: LoginRequestDto): Promise<AuthCredentialsDto> {

	  let member = await this._memberRepository.getMemberByEmail(request.email);

	  if (!member)
		  throw new exception.AccountNotFoundException(request.email);

	  if (!bcrypt.compareSync(request.password, member.person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(member, SigningCategory.MEMBER);

  }

  @JSONEndpoint
  @Path("/refresh")
  @POST
  public async refreshCredentials(@JSONBody(RefreshCredentialsRequestDto) request: RefreshCredentialsRequestDto): Promise<AuthCredentialsDto> {

	  const {refreshToken} = request;
	  return await crypto.refreshCredentials(refreshToken);

  }

  @JSONEndpoint
  @Path("/reset")
  @POST
  public async getResetPasswordCode(@JSONBody(ResetCodeRequestDto) request: ResetCodeRequestDto): Promise<ResetCodeDto> {

	  let member = await this._memberRepository.getMemberByEmail(request.email);

	  if (member == undefined)
	    throw new exception.AccountNotFoundException(request.email);

	  const resetCode = await this._personRepository.createPasswordResetCode(member.person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return {
	  	code: resetCode.id
	  } as ResetCodeDto;

  }

  @JSONEndpoint
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string, @JSONBody(ResetCodeRequestDto) request: ResetPasswordRequestDto) {
	  await this._personRepository.resetPassword(code, request);
  }

}