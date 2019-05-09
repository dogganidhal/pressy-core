import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import { Tags, Produces, Security } from "typescript-rest-swagger";
import { CreatePersonRequestDto as CreatePersonRequestDto } from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { IDriverRepository } from "../../common/repository/driver-repository";
import { RepositoryFactory } from "../../common/repository/factory";


@Produces("application/json")
@Tags("Drivers")
@Path("/driver")
export class DriverController extends BaseController {

	private _driverRepository: IDriverRepository = RepositoryFactory.instance.driverRepository;

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createDriver(@JSONBody(CreatePersonRequestDto) request: CreatePersonRequestDto) {
		await this._driverRepository.createDriver(request);
	}

}