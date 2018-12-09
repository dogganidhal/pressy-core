import { OrderRepository } from './../../common/repositories/order/order-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import { JSONResponse, Authenticate } from "../../common/annotations";
import { crypto } from "../../services/crypto";
import { http } from "../../common/utils/http";
import { Database } from '../../common/db';
import { AssignOrderDriverRequest } from '../../common/model/dto';


@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());

  @Path("/assign-driver")
	@JSONResponse
	@Authenticate(crypto.SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder() {

		let request = http.parseJSONBody(this.getPendingRequest().body, AssignOrderDriverRequest);
		await this._orderRepository.assignDriverToOrder(request);

	}

}