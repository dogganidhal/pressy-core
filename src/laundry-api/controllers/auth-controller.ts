import { Tags, Produces } from "typescript-rest-swagger";
import {Path, POST} from "typescript-rest";
import {exception} from "../../common/errors";
import bcrypt from "bcrypt";
import {BaseController} from "../../common/controller/base-controller";
import {crypto, SigningCategory, AuthCredentialsDto} from "../../services/crypto";
import {JSONEndpoint} from "../../common/annotations";
import { LoginRequestDto, RefreshCredentialsRequestDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import { IPersonRepository } from "../../common/repository/person-repository";
import { RepositoryFactory } from "../../common/repository/factory";
import { IMemberRepository } from "../../common/repository/member-repository";
import {ILaundryRepository} from "../../common/repository/laundry-repository";


@Produces("application/json")
@Tags("Authentication")
@Path('/auth')
export class AuthController extends BaseController {

  private _laundryRepository: ILaundryRepository = RepositoryFactory.instance.laundryRepository;

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