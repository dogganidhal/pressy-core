import { BaseController } from "../../common/controller/base-controller";
import { Path, POST } from "typescript-rest";
import { JSONEndpoint } from "../../common/annotations";
import { http } from "../../common/utils/http";
import { PersonRepository } from "../../common/repositories/users/person-repository";
import { Database } from "../../common/db";
import { exception } from "../../common/errors";
import bcrypt from "bcrypt";
import { crypto, SigningCategory, AuthCredentials } from "../../services/crypto";
import { LoginRequest } from "../../common/model/dto";
import { Tags, Produces } from "typescript-rest-swagger";
import {JSONBody} from "../../common/annotations/json-body";
import {AdminRepository} from "../../common/repositories/users/admin-repository";


@Produces("application/json")
@Tags("Authentication")
@Path("/auth")
export class AuthController extends BaseController {

  private _adminRepository: AdminRepository = new AdminRepository(Database.getConnection());

  @Path("/login")
  @JSONEndpoint
  @POST
  public async login(@JSONBody(LoginRequest) request: LoginRequest): Promise<AuthCredentials> {

	  let admin = await this._adminRepository.getAdminByEmail(request.email);

	  if (!admin)
		  throw new exception.AccountNotFoundException(request.email);

	  if (!bcrypt.compareSync(request.password, admin.person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(admin, SigningCategory.ADMIN);

  }

}