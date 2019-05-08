import { BaseController } from "../../common/controller/base-controller";
import { Path, POST } from "typescript-rest";
import { JSONEndpoint } from "../../common/annotations";
import { exception } from "../../common/errors";
import bcrypt from "bcrypt";
import { crypto, SigningCategory, AuthCredentialsDto } from "../../services/crypto";
import { LoginRequestDto, RefreshCredentialsRequestDto } from "../../common/model/dto";
import { Tags, Produces } from "typescript-rest-swagger";
import {JSONBody} from "../../common/annotations/json-body";
import { IAdminRepository } from "../../common/repositories/admin-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Produces("application/json")
@Tags("Authentication")
@Path("/auth")
export class AuthController extends BaseController {

  private _adminRepository: IAdminRepository = RepositoryFactory.instance.adminRepository;

  @Path("/login")
  @JSONEndpoint
  @POST
  public async login(@JSONBody(LoginRequestDto) request: LoginRequestDto): Promise<AuthCredentialsDto> {

	  let admin = await this._adminRepository.getAdminByEmail(request.email);

	  if (!admin)
		  throw new exception.AccountNotFoundException(request.email);

	  if (!bcrypt.compareSync(request.password, admin.person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(admin, SigningCategory.ADMIN);

  }

  @Path("/refresh")
  @JSONEndpoint
  @POST
  public async refreshCredentials(@JSONBody(RefreshCredentialsRequestDto) request: RefreshCredentialsRequestDto): Promise<AuthCredentialsDto> {
    return await crypto.refreshCredentials(request.refreshToken);
  }

}