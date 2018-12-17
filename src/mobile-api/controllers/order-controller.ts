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


@Produces("application/json")
@Tags("Orders")
@Path('/order')
export class OrderController extends BaseController {

	private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());
  private _slotsRepository: SlotRepository = new SlotRepository(Database.getConnection());

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createOrder(@JSONBody(CreateOrderRequest) request: CreateOrderRequest) {

	  const member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);

		let order = await this._orderRepository.createOrder(member, request);
		let orderMailSender = new OrderMailSender;

		orderMailSender.sendOrderInformationMailToAdmins(order);

	  return new Return.RequestAccepted("/v1/order");

  }

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getOrders() {

  	let member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);
	  let orders = await this._orderRepository.getOrdersForMember(member);
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
	  	let pickupAddress: IAddress = {
	  		streetNumber: order.pickupAddress.streetNumber,
			  streetName: order.pickupAddress.streetName,
			  city: order.pickupAddress.city,
			  country: order.pickupAddress.country,
			  formattedAddress: order.pickupAddress.formattedAddress,
			  zipCode: order.pickupAddress.zipCode
		  };
	  	let deliveryAddress: IAddress = order.deliveryAddress ? {
			  streetNumber: order.deliveryAddress.streetNumber,
			  streetName: order.deliveryAddress.streetName,
			  city: order.deliveryAddress.city,
			  country: order.deliveryAddress.country,
			  formattedAddress: order.deliveryAddress.formattedAddress,
			  zipCode: order.deliveryAddress.zipCode
		  } : pickupAddress;
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
			  pickupSlot: pickupSlot, pickupAddress: pickupAddress,
			  deliverySlot: deliverySlot, deliveryAddress: deliveryAddress,
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