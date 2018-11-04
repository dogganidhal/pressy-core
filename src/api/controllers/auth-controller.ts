import {Path, PathParam, POST, Return} from "typescript-rest";
import {
	LoginRequestDTO,
	MemberPasswordResetCodeDTO,
	MemberPasswordResetCodeRequestDTO,
	PersonPasswordResetRequestDTO,
	RefreshCredentialsRequestDTO
} from "../../common/model/dto/member";
import {Exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {PersonRepository} from "../../common/repositories/person-repository";
import {MemberRepository} from "../../common/repositories/member-repository";
import {BaseController} from "./base-controller";
import {JSONResponse} from "../annotations";
import {Database} from "../../common/db";
import {Crypto} from "../../common/services/crypto";
import {HTTP} from "../../common/utils/http";


@Path('/api/v1/auth/')
export class AuthController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @JSONResponse
  @Path("/member/")
  @POST
  public async login() {

	  let loginRequest = HTTP.parseJSONBody(this.getPendingRequest().body, LoginRequestDTO);
	  let member = await this._memberRepository.getMemberByEmail(loginRequest.email);

	  if (!member)
		  throw new Exception.MemberNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, member.person.passwordHash))
		  throw new Exception.WrongPasswordException;

	  return Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);

  }

  @JSONResponse
  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

	  const {refreshToken} = JSON.parse(this.getPendingRequest().body) as RefreshCredentialsRequestDTO;
	  return await Crypto.refreshCredentials(refreshToken);

  }

  @JSONResponse
  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

	  const resetCodeRequest: MemberPasswordResetCodeRequestDTO = JSON.parse(this.getPendingRequest().body);

	  const person = await this._personRepository.getPersonByEmail(resetCodeRequest.email);

	  if (person == undefined)
	    throw new Exception.MemberNotFoundException(resetCodeRequest.email);

	  const resetCode = await this._personRepository.createPasswordResetCode(person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return {
	  	code: resetCode.id
	  } as MemberPasswordResetCodeDTO;

  }

  @JSONResponse
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

	  const resetPasswordRequest: PersonPasswordResetRequestDTO = JSON.parse(this.getPendingRequest().body);
	  const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

	  return new Return.RequestAccepted(`/api/v1/member/${person.id}`);

  }

}