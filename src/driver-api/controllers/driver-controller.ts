import {Path} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import { IDriverRepository } from "../../common/repositories/driver-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Path("/driver/")
export class DriverController extends BaseController {

  private _driverRepository: IDriverRepository = RepositoryFactory.instance.createDriverRepository();

}