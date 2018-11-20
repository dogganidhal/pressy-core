import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {exception} from '../../common/errors';
import {OrderRepository} from '../../common/repositories/order/order-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {DateUtils} from '../../common/utils';
import {Member} from "../../common/model/entity/users/member/member";
import {SlotType} from "../../common/model/entity/slot";
import {BaseController} from "./base-controller";
import {Authenticate, JSONResponse} from "../annotations";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";
import {MemberRepository} from "../../common/repositories/users/member-repository";
import {http} from "../../common/utils/http";
import * as DTO from "../../common/model/dto";
import {Order} from "../../common/model/entity/order";


@Path('/api/v1/order/')
export class OrderController extends BaseController {

	private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());
  private _slotsRepository: SlotRepository = new SlotRepository(Database.getConnection());

  @JSONResponse
  @Authenticate(crypto.SigningCategory.MEMBER)
  @POST
  public async createOrder() {

	  const dto = http.parseJSONBody(this.getPendingRequest().body, DTO.order.CreateOrderRequest);
	  const member: Member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);

	  await this._orderRepository.createOrder(member, dto);

	  return new Return.RequestAccepted("/api/v1/order");

  }

  @JSONResponse
  @Authenticate(crypto.SigningCategory.MEMBER)
  @GET
  public async getOrders() {

  	let member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);
	  let orders = await this._orderRepository.getOrdersForMember(member);
	  return orders.map((order: Order) => {

	  	let pickupSlot: DTO.slot.ISlot = {
	  		id: order.pickupSlot.id,
			  startDate: order.pickupSlot.startDate,
			  type: order.pickupSlot.type
		  };
	  	let deliverySlot: DTO.slot.ISlot = {
			  id: order.deliverySlot.id,
			  startDate: order.deliverySlot.startDate,
			  type: order.deliverySlot.type
		  };
	  	let pickupAddress: DTO.address.IAddress = {
	  		streetNumber: order.pickupAddress.streetNumber,
			  streetName: order.pickupAddress.streetName,
			  city: order.pickupAddress.city,
			  country: order.pickupAddress.country,
			  formattedAddress: order.pickupAddress.formattedAddress,
			  zipCode: order.pickupAddress.zipCode
		  };
	  	let deliveryAddress: DTO.address.IAddress = order.deliveryAddress ? {
			  streetNumber: order.deliveryAddress.streetNumber,
			  streetName: order.deliveryAddress.streetName,
			  city: order.deliveryAddress.city,
			  country: order.deliveryAddress.country,
			  formattedAddress: order.deliveryAddress.formattedAddress,
			  zipCode: order.deliveryAddress.zipCode
		  } : pickupAddress;
	  	let member: DTO.person.IPersonInfo = {
			  id: order.member.id,
			  firstName: order.member.person.firstName,
			  lastName: order.member.person.lastName,
			  email: order.member.person.email,
			  phone: order.member.person.phone,
			  created: order.member.person.created
		  };
	  	let elements: Array<DTO.order.IOrderElement> = order.elements.map(e => new DTO.order.OrderElement({
			  type: e.type, orderId: order.id, color: e.color, comment: e.comment
		  }));

	  	return new DTO.order.Order({
			  pickupSlot: pickupSlot, pickupAddress: pickupAddress,
			  deliverySlot: deliverySlot, deliveryAddress: deliveryAddress,
			  member: member, id: order.id, elements: elements
		  })

	  });

  }

  @JSONResponse
  @Path("/slots")
  @GET
  public async getSlots(
    @QueryParam("types") typeString: string, 
    @QueryParam("from") from: string = DateUtils.now().toISOString(),
    @QueryParam("to") to: string = DateUtils.addDaysFromNow(7).toISOString()
  ) {

	  const types = this._parseSlotTypesFromString(typeString);
    const startDate = new Date(from);
	  const endDate = new Date(to);

    if (isNaN(startDate.getTime()))
      throw new exception.InvalidDateException(from);

    if (isNaN(endDate.getTime()))
	    throw new exception.InvalidDateException(to);

    const slots = await this._slotsRepository.searchSlots({
	    from: startDate,
	    to: endDate,
	    types: this._parseSlotTypesFromString(typeString)
    });

	  return slots.map(slot => new DTO.slot.Slot(slot));

  }

  private _parseSlotTypesFromString(string: string): SlotType[] {
    const types: SlotType[] = string.split(",").map(char => {
      const type = parseInt(char);
      if (type < SlotType.LIGHT || type > SlotType.EXPRESS) {
	      throw new exception.InvalidSlotTypeException(type);
      }
      return type;
    });
    return types.filter((type, index) => types.indexOf(type) == index);
  }

}