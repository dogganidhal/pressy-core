import { AssignDriverSlotsRequest } from "./../../common/model/dto/driver";
import { Tags, Security } from "typescript-rest-swagger";
import { OrderRepository } from './../../common/repositories/order/order-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import { JSONResponse, Authenticate } from "../../common/annotations";
import { SigningCategory } from "../../services/crypto";
import { http } from "../../common/utils/http";
import { Database } from '../../common/db';
import { AssignOrderDriverRequest } from '../../common/model/dto';


@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());

	@Security("Bearer")
  @Path("/assign-driver")
	@JSONResponse
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder(request: AssignDriverSlotsRequest) {

		let assignRequest = http.parseJSONBody(this.getPendingRequest().body, AssignOrderDriverRequest);
		await this._orderRepository.assignDriverToOrder(assignRequest);

	}

}