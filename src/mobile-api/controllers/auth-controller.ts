import { Tags, Produces } from "typescript-rest-swagger";
import {Path, PathParam, POST, Return} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {PersonRepository} from "../../common/repositories/users/person-repository";
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {crypto, SigningCategory, AuthCredentials} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {JSONEndpoint} from "../../common/annotations";
import { LoginRequest, RefreshCredentialsRequest, ResetCodeRequest, ResetCode, ResetPasswordRequest } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {MemberRepository} from "../../common/repositories/users/member-repository";


@Produces("application/json")
@Tags("Authentication")
@Path('/auth')
export class AuthController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
	private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @JSONEndpoint
  @POST
  public async login(@JSONBody(LoginRequest) request: LoginRequest): Promise<AuthCredentials> {

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
  public async refreshCredentials(@JSONBody(RefreshCredentialsRequest) request: RefreshCredentialsRequest): Promise<AuthCredentials> {

	  const {refreshToken} = request;
	  return await crypto.refreshCredentials(refreshToken);

  }

  @JSONEndpoint
  @Path("/reset")
  @POST
  public async getResetPasswordCode(@JSONBody(ResetCodeRequest) request: ResetCodeRequest): Promise<ResetCode> {

	  let member = await this._memberRepository.getMemberByEmail(request.email);

	  if (member == undefined)
	    throw new exception.AccountNotFoundException(request.email);

	  const resetCode = await this._personRepository.createPasswordResetCode(member.person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return {
	  	code: resetCode.id
	  } as ResetCode;

  }

  @JSONEndpoint
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string, @JSONBody(ResetCodeRequest) request: ResetPasswordRequest) {
	  await this._personRepository.resetPassword(code, request);
  }

}