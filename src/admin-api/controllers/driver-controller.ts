import { ExcelGenerator } from './../../services/excel-generator';
import {BaseController} from "../../common/controller/base-controller";
import {Path, POST, GET} from "typescript-rest";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {crypto} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {person, driver} from "../../common/model/dto";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Database} from "../../common/db";
import { MailingService } from "../../services/mailing-service";

@Path("/v1/driver")
export class DriverController extends BaseController {

	private _driverRepository: DriverRepository = new DriverRepository(Database.getConnection());

	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async createDriver() {

		let createPersonRequest = http.parseJSONBody(this.getPendingRequest().body, person.CreatePersonRequest);
		await this._driverRepository.createDriver(createPersonRequest);

	}

	@Path("/assign")
	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder() {

		let request = http.parseJSONBody(this.getPendingRequest().body, driver.AssignOrderDriverRequest);
		await this._driverRepository.assignDriverToOrder(request);

	}

	@JSONResponse
	@Path("send-test-mail")
	@GET
	public async sendTestMail() {
		let excelGenerator = new ExcelGenerator;
		let mailingService = new MailingService;
		let excelPath = await excelGenerator.generateTestExcelFile();
		return await mailingService.sendTestMail(excelPath);
	}

	@JSONResponse
	@Path("create-test-excel")
	@GET
	public async createTestExcel() {
		let excelGenerator = new ExcelGenerator;
		await excelGenerator.generateTestExcelFile();
	}

}