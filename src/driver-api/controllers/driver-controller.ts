import {Path, POST, Return} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db/index";
import {crypto} from "../../services/crypto";
import {person} from "../../common/model/dto/index";
import {http} from "../../common/utils/http";
import {DriverRepository} from "../../common/repositories/users/driver-repository";
import {Authenticate, JSONResponse} from "../../common/annotations/index";


@Path("/v1/driver/")
export class DriverController extends BaseController {

  private _driverRepository = new DriverRepository(Database.getConnection());

  @Authenticate(crypto.SigningCategory.ADMIN)
  @JSONResponse
  @POST
  public async createDriver() {

    let createDriverRequest = http.parseJSONBody(this.getPendingRequest().body, person.CreatePersonRequest);
    await this._driverRepository.createDriver(createDriverRequest);
    return new Return.RequestAccepted('/v1/driver');

  }

}