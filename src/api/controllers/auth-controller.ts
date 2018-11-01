import { getConnection } from 'typeorm';
import {Path, POST, HttpError, Errors, Return, PathParam} from "typescript-rest";
import {LoginRequestDTO, RefreshCredentialsRequestDTO, PersonPasswordResetRequestDTO, MemberPasswordResetCodeDTO, MemberPasswordResetCodeRequestDTO} from "../../common/model/dto/member";
import { Exception } from "../../common/errors";
import { HTTPUtils } from "../../common/utils/http-utils";
import { JSONSerialization } from "../../common/utils/json-serialization";
import bcrypt from "bcrypt";
import { PersonRepository } from "../../common/repositories/person-repository";
import { MemberRepository } from "../../common/repositories/member-repository";
import { AuthRepository } from "../../common/repositories/auth-repository";
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

	  const loginRequest = HTTPUtils.parseBody(this.getPendingRequest().body, LoginRequestDTO);

	  const member = await this._memberRepository.getMemberByEmail(loginRequest.email);
	  if (!member)
		  throw new Exception.MemberNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, member.person.passwordHash))
		  throw new Exception.WrongPasswordException;

	  return await this._authRepository.generateToken(member.person);

  }

  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

    try {

      const refreshRequest = HTTPUtils.parseBodyOfContoller(this, RefreshCredentialsRequestDTO);
      return await this._authRepository.createNewCredentials(refreshRequest);

    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);
      else
        this.throw(new Errors.BadRequestError(error.message));
    }

  }

  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

    try {

      const resetCodeRequest = HTTPUtils.parseBodyOfContoller(this, MemberPasswordResetCodeRequestDTO);

      const person = await this._personRepository
        .getPersonByEmail(resetCodeRequest.email);

      if (person == undefined) {
        this.throw(new Exception.MemberNotFoundException(resetCodeRequest.email!));
        return;
      }
      
      const resetCode = await this._personRepository.createPasswordResetCode(person);
      const resetCodeDTO = MemberPasswordResetCodeDTO.create(resetCode.id!);

      // TODO: Return an empty "accepted" response, and call the email service
      return JSONSerialization.serializeObject(resetCodeDTO);

    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

    try {

      const resetPasswordRequest = HTTPUtils.parseBodyOfContoller(this, PersonPasswordResetRequestDTO);
      const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

      return new Return.RequestAccepted(`/api/v1/member/${person.id}`);

    } catch (error) {
      if (error instanceof Error) 
        this.throw(new Errors.BadRequestError((error as Error).message));
      else if (error instanceof HttpError)
        this.throw(error);
    }

  }

}