import { Tags, Security, Produces } from "typescript-rest-swagger";
import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {OrderRepository} from '../../common/repositories/order/order-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { OrderMailSender } from "../../common/mail-senders/order-mail-sender";
import { CreateOrderRequestDto, OrderDto, SlotDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member/member";


@Produces("application/json")
@Tags("Orders")
@Path('/order')
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());
  private _slotsRepository: SlotRepository = new SlotRepository(Database.getConnection());

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createOrder(@JSONBody(CreateOrderRequestDto) request: CreateOrderRequestDto) {

		let order = await this._orderRepository.createOrder(<Member>this.pendingUser, request);
		let orderMailSender = new OrderMailSender;

		orderMailSender.sendOrderInformationMailToAdmins(order);

	  return new Return.RequestAccepted("/v1/order");

  }

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getOrders() {

	  let orders = await this._orderRepository.getOrdersForMember(<Member>this.pendingUser);
	  return orders.map(order => new OrderDto(order));

  }

  @JSONEndpoint
  @Path("/slots")
  @GET
  public async getNextAvailableSlots(@QueryParam("type") type?: string): Promise<SlotDto[]> {

    let slots = await this._slotsRepository.getAvailableSlots(type);
	  return slots.map(slot => new SlotDto(slot));

  }

}