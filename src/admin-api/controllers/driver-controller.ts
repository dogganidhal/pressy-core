import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import { Tags, Produces } from "typescript-rest-swagger";
import { CreatePersonRequestDto as CreatePersonRequestDto } from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { IDriverRepository } from "../../common/repositories/driver-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Produces("application/json")
@Tags("Drivers")
@Path("/driver")
export class DriverController extends BaseController {

	private _driverRepository: IDriverRepository = RepositoryFactory.instance.createDriverRepository();

	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createDriver(@JSONBody(CreatePersonRequestDto) request: CreatePersonRequestDto) {
		await this._driverRepository.createDriver(request);
	}

}