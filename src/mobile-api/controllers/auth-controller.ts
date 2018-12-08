import {Path, PathParam, POST, Return} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {PersonRepository} from "../../common/repositories/users/person-repository";
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../services/crypto";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";
import {JSONResponse} from "../../common/annotations";


@Path('/auth/')
export class AuthController extends BaseController {

  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @JSONResponse
  @POST
  public async login() {

	  let loginRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.LoginRequest);
	  let person = await this._personRepository.getPersonByEmail(loginRequest.email);

	  if (!person)
		  throw new exception.AccountNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(person, crypto.SigningCategory.MEMBER);

  }

  @JSONResponse
  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

	  const {refreshToken} = http.parseJSONBody(this.getPendingRequest().body, DTO.person.RefreshCredentialsRequest);
	  return await crypto.refreshCredentials(refreshToken);

  }

  @JSONResponse
  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

	  const resetCodeRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.ResetCodeRequest);

	  const person = await this._personRepository.getPersonByEmail(resetCodeRequest.email);

	  if (person == undefined)
	    throw new exception.AccountNotFoundException(resetCodeRequest.email);

	  const resetCode = await this._personRepository.createPasswordResetCode(person);

	  // TODO: Return an empty "accepted" response, and call the email service
	  return {
	  	code: resetCode.id
	  } as DTO.person.ResetCode;

  }

  @JSONResponse
  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

	  const resetPasswordRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.ResetPasswordRequest);
	  const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

	  return new Return.RequestAccepted(`/v1/member/${person.id}`);

  }

}