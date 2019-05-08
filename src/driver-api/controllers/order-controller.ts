import { BaseController } from "../../common/controller/base-controller";
import { Path, PATCH } from "typescript-rest";
import { JSONEndpoint, Authenticate } from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {Tags, Produces, Security} from "typescript-rest-swagger";
import {JSONBody} from "../../common/annotations/json-body";
import {RepositoryFactory} from "../../common/repositories/factory";
import {IOrderStatusRepository} from "../../common/repositories";
import {UpdateOrderRequestDto} from "../../common/model/dto/order/update-order";
import {Driver} from "../../common/model/entity/users/driver/driver";


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderStatusRepository: IOrderStatusRepository = RepositoryFactory.instance.orderStatusRepository;

  @Security("Bearer")
  @Authenticate(SigningCategory.DRIVER)
  @JSONEndpoint
  @PATCH
  public async updateOrder(@JSONBody(UpdateOrderRequestDto) request: UpdateOrderRequestDto): Promise<void> {
    let driver = <Driver>this.pendingUser;
	  await this._orderStatusRepository.updateOrderStatus(driver, request);
  }

}
