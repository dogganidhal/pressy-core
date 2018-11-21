import {Path, POST, Return} from "typescript-rest";
import {MemberRepository} from "../../common/repositories/users/member-repository";
import {Authenticate, JSONResponse} from "../annotations";
import {BaseController} from "./base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";
import {person} from "../../common/model/dto";
import {http} from "../../common/utils/http";
import {DriverRepository} from "../../common/repositories/users/driver-repository";


@Path("/api/v1/driver/")
export class DriverController extends BaseController {

  private _driverRepository = new DriverRepository(Database.getConnection());

  @Authenticate(crypto.SigningCategory.ADMIN)
  @JSONResponse
  @POST
  public async createDriver() {

    let createDriverRequest = http.parseJSONBody(this.getPendingRequest().body, person.CreatePersonRequest);
    await this._driverRepository.createDriver(createDriverRequest);
    return new Return.RequestAccepted('/api/v1/driver');

  }

}