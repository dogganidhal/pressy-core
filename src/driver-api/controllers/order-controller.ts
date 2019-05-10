import { BaseController } from "../../common/controller/base-controller";
import { Path, PATCH, POST, PathParam } from "typescript-rest";
import { JSONEndpoint, Authenticate } from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {Tags, Produces, Security} from "typescript-rest-swagger";
import {JSONBody} from "../../common/annotations/json-body";
import {RepositoryFactory} from "../../common/repository/factory";
import {IOrderStatusRepository, IOrderRepository} from "../../common/repository";
import {UpdateOrderRequestDto, UpdateOrderReason} from "../../common/model/dto/order/update-order";
import {Driver} from "../../common/model/entity/users/driver/driver";
import Stripe from "stripe";
import { getConfig } from "../../config";
import { IOrderManager } from "../../common/manager/order";
import { ManagerFactory } from "../../common/manager";


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderStatusRepository: IOrderStatusRepository = RepositoryFactory.instance.orderStatusRepository;
  private _orderManager: IOrderManager = ManagerFactory.instance.orderManager;

  @Security("Bearer")
  @Authenticate(SigningCategory.DRIVER)
  @JSONEndpoint
  @PATCH
  public async updateOrder(@JSONBody(UpdateOrderRequestDto) request: UpdateOrderRequestDto): Promise<void> {
    let driver = <Driver>this.pendingUser;
	  await this._orderStatusRepository.updateOrderStatus(driver, request);
  }

  @Security("Bearer")
  @Authenticate(SigningCategory.DRIVER)
  @JSONEndpoint
  @POST
  @Path("/report-absent/:id")
  public async reportAbsent(@PathParam("id") orderId: number): Promise<void> {
    let driver = <Driver>this.pendingUser;
    await this._orderStatusRepository.updateOrderStatus(driver, {id: orderId, reason: UpdateOrderReason.CLIENT_ABSENT});
    await this._orderManager.applyAbsencePenalty(orderId);
  }

}
