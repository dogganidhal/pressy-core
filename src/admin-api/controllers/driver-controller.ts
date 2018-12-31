import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Database} from "../../common/db";
import { Tags, Produces } from "typescript-rest-swagger";
import { CreatePersonRequestDto as CreatePersonRequestDto } from "../../common/model/dto";


@Produces("application/json")
@Tags("Drivers")
@Path("/driver")
export class DriverController extends BaseController {

	private _driverRepository: DriverRepository = new DriverRepository(Database.getConnection());

	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createDriver(request: CreatePersonRequestDto) {

		let createPersonRequest = http.parseJSONBody(this.getPendingRequest().body, CreatePersonRequestDto);
		await this._driverRepository.createDriver(createPersonRequest);

	}

}