import {Path, POST} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations/index";
import { CreatePersonRequestDto } from "../../common/model/dto";
import { IDriverRepository } from "../../common/repositories/driver-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Path("/driver/")
export class DriverController extends BaseController {

  private _driverRepository: IDriverRepository = RepositoryFactory.instance.createDriverRepository();

  @Authenticate(SigningCategory.ADMIN)
  @JSONEndpoint
  @POST
  public async createDriver() {

    let createDriverRequest = http.parseJSONBody(this.getPendingRequest().body, CreatePersonRequestDto);
    await this._driverRepository.createDriver(createDriverRequest);

  }

}