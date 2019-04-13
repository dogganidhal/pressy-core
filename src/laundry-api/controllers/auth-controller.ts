import { Tags, Produces } from "typescript-rest-swagger";
import {Path, POST} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {BaseController} from "../../common/controller/base-controller";
import {crypto, SigningCategory, AuthCredentialsDto} from "../../services/crypto";
import {JSONEndpoint} from "../../common/annotations";
import { LoginRequestDto, RefreshCredentialsRequestDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import { IPersonRepository } from "../../common/repositories/person-repository";
import { RepositoryFactory } from "../../common/repositories/factory";
import { IMemberRepository } from "../../common/repositories/member-repository";
import {ILaundryRepository} from "../../common/repositories/laundry-repository";


@Produces("application/json")
@Tags("Authentication")
@Path('/auth')
export class AuthController extends BaseController {

  private _laundryRepository: ILaundryRepository = RepositoryFactory.instance.createLaundryRepository();

  @JSONEndpoint
  @POST
  public async login(@JSONBody(LoginRequestDto) request: LoginRequestDto): Promise<AuthCredentialsDto> {

	  let laundrer = await this._laundryRepository.getLaundrerByEmail(request.email);

	  if (!laundrer)
		  throw new exception.AccountNotFoundException(request.email);

	  if (!bcrypt.compareSync(request.password, laundrer.person.passwordHash))
		  throw new exception.WrongPasswordException;

	  return crypto.signAuthToken(laundrer, SigningCategory.LAUNDRER);

  }

  @JSONEndpoint
  @Path("/refresh")
  @POST
  public async refreshCredentials(@JSONBody(RefreshCredentialsRequestDto) request: RefreshCredentialsRequestDto): Promise<AuthCredentialsDto> {

	  const {refreshToken} = request;
	  return await crypto.refreshCredentials(refreshToken);

  }
}