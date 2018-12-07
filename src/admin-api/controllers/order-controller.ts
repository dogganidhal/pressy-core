import { OrderRepository } from './../../common/repositories/order/order-repository';
import { DriverRepository } from './../../common/repositories/users/driver-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import { JSONResponse, Authenticate } from "../../common/annotations";
import { crypto } from "../../services/crypto";
import { http } from "../../common/utils/http";
import { order } from "../../common/model/dto";
import { Database } from '../../common/db';


@Path("/v1/order")
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());

  @Path("/assign-driver")
	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder() {

		let request = http.parseJSONBody(this.getPendingRequest().body, order.AssignOrderDriverRequest);
		await this._orderRepository.assignDriverToOrder(request);

	}

}