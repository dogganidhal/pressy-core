import { BaseController } from "../../common/controller/base-controller";
import { Path, POST } from "typescript-rest";
import { JSONResponse } from "../../common/annotations";
import { http } from "../../common/utils/http";
import { PersonRepository } from "../../common/repositories/users/person-repository";
import { Database } from "../../common/db";
import * as DTO from "../../common/model/dto";
import { exception } from "../../common/errors";
import bcrypt from "bcrypt";
import { crypto } from "../../services/crypto";


@Path("/auth")
export class AuthController extends BaseController {

  private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());

  @Path("/login")
  @JSONResponse
  @POST
  public async login() {

    let loginRequest = http.parseJSONBody(this.getPendingRequest().body, DTO.person.LoginRequest);
	  let person = await this._personRepository.getPersonByEmail(loginRequest.email);

	  if (!person)
		  throw new exception.AccountNotFoundException(loginRequest.email);

	  if (!bcrypt.compareSync(loginRequest.password, person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(person, crypto.SigningCategory.ADMIN);

  }

}