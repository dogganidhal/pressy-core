import {getConnection} from 'typeorm';
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
import {AuthRepository} from "../../common/repositories/auth-repository";
import {BaseController} from "./base-controller";
import {JSONResponse} from "../annotations/json-response";

@Path('/api/v1/auth/')
export class AuthController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(getConnection());
  private _personRepository: PersonRepository = new PersonRepository(getConnection());
  private _authRepository: AuthRepository = new AuthRepository(getConnection());

  @JSONResponse
  @Path("/login/")
  @POST
  public async login() {

	  const loginRequest = this.getPendingRequest().body as LoginRequestDTO;

	  const member = await this._memberRepository.getMemberByEmail(loginRequest.email);
	  if (!member)
		  throw new Exception.MemberNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, member.person.passwordHash))
		  throw new Exception.WrongPasswordException;

	  return await this._authRepository.generateToken(member.person);

  }

  @JSONResponse
  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

	  const refreshRequest = this.getPendingRequest().body as RefreshCredentialsRequestDTO;
	  return await this._authRepository.createNewCredentials(refreshRequest);

  }

  @JSONResponse
  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

	  const resetCodeRequest = this.getPendingRequest().body as MemberPasswordResetCodeRequestDTO;

	  const person = await this._personRepository
		  .getPersonByEmail(resetCodeRequest.email);

	  if (person == undefined)
	    throw new Exception.MemberNotFoundException(resetCodeRequest.email!)

	  const resetCode = await this._personRepository.createPasswordResetCode(person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return new MemberPasswordResetCodeDTO(resetCode.id);

  }

  @JSONResponse
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

	  const resetPasswordRequest = this.getPendingRequest().body as PersonPasswordResetRequestDTO;
	  const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

	  return new Return.RequestAccepted(`/api/v1/member/${person.id}`);

  }

}