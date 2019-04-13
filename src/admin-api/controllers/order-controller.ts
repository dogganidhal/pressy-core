import {Produces, Security, Tags} from "typescript-rest-swagger";
import {BaseController} from "../../common/controller/base-controller";
import {GET, Path, POST, QueryParam, PATCH, PathParam} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {AssignOrderDriverRequestDto, OrderDto, EditOrderRequestDto} from '../../common/model/dto';
import {JSONBody} from "../../common/annotations/json-body";
import { IOrderRepository } from "../../common/repositories/order-repository";
import { RepositoryFactory } from "../../common/repositories/factory";
import { OrderMissionType } from "../../common/model/entity/order";
import { NotFoundError } from "typescript-rest/dist/server-errors";


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: IOrderRepository = RepositoryFactory.instance.createOrderRepository();

	@Security("Bearer")
  @Path("/assign-driver/:orderMissionType")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder(@PathParam("orderMissionType") missionType: OrderMissionType, @JSONBody(AssignOrderDriverRequestDto) request: AssignOrderDriverRequestDto) {
		switch(missionType) {
			case OrderMissionType.PICKUP:
				await this._orderRepository.assignDriverToPickupOrder(request);
				break;
			case OrderMissionType.DELIVERY:
				await this._orderRepository.assignDriverToDeliverOrder(request);
				break;
			default:
				throw new NotFoundError();
		}
	}

	@Security("Bearer")
	@Authenticate(SigningCategory.ADMIN)
	@GET
	@JSONEndpoint
	public async getOrders(@QueryParam("length") pageLength: number = 10, @QueryParam("page") page: number = 0): Promise<OrderDto[]> {
		let orders = await this._orderRepository.getOrders(pageLength, page);
		return orders.map(order => new OrderDto(order));
	}

	@Security("Bearer")
	@Authenticate(SigningCategory.ADMIN)
	@PATCH
	@JSONEndpoint
	public async editOrder(@JSONBody(EditOrderRequestDto) request: EditOrderRequestDto): Promise<OrderDto> {
		let order = await this._orderRepository.editOrder(request);
		return new OrderDto(order);
	}

}