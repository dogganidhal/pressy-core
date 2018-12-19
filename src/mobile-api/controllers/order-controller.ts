import { Tags, Security, Produces } from "typescript-rest-swagger";
import {GET, Path, POST, Return} from "typescript-rest";
import {OrderRepository} from '../../common/repositories/order/order-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {MemberRepository} from "../../common/repositories/users/member-repository";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { OrderMailSender } from "../../common/mail-senders/order-mail-sender";
import { CreateOrderRequest, ISlot, IAddress, IPersonInfo, OrderElement, IOrderElement, Order, Slot } from "../../common/model/dto";
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
  public async createOrder(@JSONBody(CreateOrderRequest) request: CreateOrderRequest) {

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
	  return orders.map((order) => {

	  	let pickupSlot: ISlot = {
	  		id: order.pickupSlot.id,
			  startDate: order.pickupSlot.startDate,
			  type: order.pickupSlot.type
		  };
	  	let deliverySlot: ISlot = {
			  id: order.deliverySlot.id,
			  startDate: order.deliverySlot.startDate,
			  type: order.deliverySlot.type
		  };
	  	let address: IAddress = {
	  		streetNumber: order.address.streetNumber,
			  streetName: order.address.streetName,
			  city: order.address.city,
			  country: order.address.country,
			  formattedAddress: order.address.formattedAddress,
			  zipCode: order.address.zipCode
		  };
	  	let member: IPersonInfo = {
			  id: order.member.id,
			  firstName: order.member.person.firstName,
			  lastName: order.member.person.lastName,
			  email: order.member.person.email,
			  phone: order.member.person.phone,
			  created: order.member.person.created
		  };
	  	let elements: Array<IOrderElement> = order.elements.map(e => new OrderElement({
			  type: e.type, orderId: order.id, color: e.color, comment: e.comment
		  }));

	  	return new Order({
			  pickupSlot: pickupSlot, address: address,
			  deliverySlot: deliverySlot,
			  member: member, id: order.id, elements: elements
		  })

	  });

  }

  @JSONEndpoint
  @Path("/slots")
  @GET
  public async getSlots(): Promise<Slot[]> {

    let slots = await this._slotsRepository.getNextAvailableSlots();
	  return slots.map(slot => new Slot(slot));

  }

}