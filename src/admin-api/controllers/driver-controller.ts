import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {crypto} from "../../common/services/crypto";
import {http} from "../../common/utils/http";
import {person} from "../../common/model/dto";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Database} from "../../common/db";
import { PersonRepository } from "../../common/repositories/users/person-repository";


@Path("/v1/driver")
export class DriverController extends BaseController {

	private _personRepository: PersonRepository = new PersonRepository(Database.getConnection());
	private _driverRepository: DriverRepository = new DriverRepository(Database.getConnection());

	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async createDriver() {

		let createPersonRequest = http.parseJSONBody(this.getPendingRequest().body, person.CreatePersonRequest);
		await this._driverRepository.createDriver(createPersonRequest);

	}

}