import {AssignDriverSlotsRequestDto } from "../../common/model/dto/driver";
import {Produces, Security, Tags} from "typescript-rest-swagger";
import {OrderRepository} from '../../common/repositories/order/order-repository';
import {BaseController} from "../../common/controller/base-controller";
import {GET, Path, POST, QueryParam} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Database} from '../../common/db';
import {AssignOrderDriverRequestDto, OrderDto} from '../../common/model/dto';
import {JSONBody} from "../../common/annotations/json-body";


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());

	@Security("Bearer")
  @Path("/assign-driver")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder(@JSONBody(AssignDriverSlotsRequestDto) request: AssignDriverSlotsRequestDto) {

		let assignRequest = http.parseJSONBody(this.getPendingRequest().body, AssignOrderDriverRequestDto);
		await this._orderRepository.assignDriverToOrder(assignRequest);

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