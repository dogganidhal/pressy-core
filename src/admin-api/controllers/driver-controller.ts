import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {crypto} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {person} from "../../common/model/dto";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Database} from "../../common/db";
import { Response } from "typescript-rest-swagger";


@Path("/driver")
export class DriverController extends BaseController {

	private _driverRepository: DriverRepository = new DriverRepository(Database.getConnection());

	@Response<void>(200)
	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async createDriver() {

		let createPersonRequest = http.parseJSONBody(this.getPendingRequest().body, person.CreatePersonRequest);
		await this._driverRepository.createDriver(createPersonRequest);

	}

}