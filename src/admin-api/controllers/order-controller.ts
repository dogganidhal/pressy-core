import {Produces, Security, Tags} from "typescript-rest-swagger";
import {BaseController} from "../../common/controller/base-controller";
import {GET, Path, POST, QueryParam} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {AssignOrderDriverRequestDto, OrderDto} from '../../common/model/dto';
import {JSONBody} from "../../common/annotations/json-body";
import { IOrderRepository } from "../../common/repositories/order-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: IOrderRepository = RepositoryFactory.instance.createOrderRepository();

	@Security("Bearer")
  @Path("/assign-driver")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder(@JSONBody(AssignOrderDriverRequestDto) request: AssignOrderDriverRequestDto) {
		await this._orderRepository.assignDriverToOrder(request);
	}

	@Security("Bearer")
	@Authenticate(SigningCategory.ADMIN)
	@GET
	@JSONEndpoint
	public async getOrders(@QueryParam("length") pageLength: number = 10, @QueryParam("page") page: number = 0): Promise<OrderDto[]> {
		let orders = await this._orderRepository.getOrders(pageLength, page);
		return orders.map(order => new OrderDto(order));
	}

}