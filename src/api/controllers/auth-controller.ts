import {Path, PathParam, POST, Return} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {PersonRepository} from "../../common/repositories/person-repository";
import {MemberRepository} from "../../common/repositories/member-repository";
import {BaseController} from "./base-controller";
import {JSONResponse} from "../annotations";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";



@Path('/api/v1/auth/')
export class AuthController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @JSONResponse
  @Path("/member/")
  @POST
  public async login() {

	  let loginRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.member.LoginRequest);
	  let member = await this._memberRepository.getMemberByEmail(loginRequest.email);

	  if (!member)
		  throw new exception.MemberNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, member.person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER);

  }

  @JSONResponse
  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

	  const {refreshToken} = http.parseJSONBody(this.getPendingRequest().body, DTO.member.RefreshCredentialsRequest);
	  return await crypto.refreshCredentials(refreshToken);

  }

  @JSONResponse
  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

	  const resetCodeRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.member.ResetCodeRequest);

	  const person = await this._personRepository.getPersonByEmail(resetCodeRequest.email);

	  if (person == undefined)
	    throw new exception.MemberNotFoundException(resetCodeRequest.email);

	  const resetCode = await this._personRepository.createPasswordResetCode(person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return {
	  	code: resetCode.id
	  } as DTO.member.ResetCode;

  }

  @JSONResponse
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

	  const resetPasswordRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.member.ResetPasswordRequest);
	  const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

	  return new Return.RequestAccepted(`/api/v1/member/${person.id}`);

  }

}