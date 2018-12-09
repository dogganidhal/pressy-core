import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Database} from "../../common/db";
import { Tags, Produces } from "typescript-rest-swagger";
import { CreatePersonRequest } from "../../common/model/dto";


@Produces("application/json")
@Tags("Drivers")
@Path("/driver")
export class DriverController extends BaseController {

	private _driverRepository: DriverRepository = new DriverRepository(Database.getConnection());

	@JSONResponse
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createDriver(request: CreatePersonRequest) {

		let createPersonRequest = http.parseJSONBody(this.getPendingRequest().body, CreatePersonRequest);
		await this._driverRepository.createDriver(createPersonRequest);

	}

}