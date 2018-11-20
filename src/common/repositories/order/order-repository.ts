import {Order} from '../../model/entity/order';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member/member';
import {BaseRepository} from '../base-repository';
import {OrderStatusManager} from "./order-status-manager";
import * as DTO from "../../model/dto";
import {Slot} from "../../model/entity/slot";
import {exception} from "../../errors";
import {GeocodeService} from "../../services/geocode-service";
import {Address} from "../../model/entity/common/address";
import {Driver} from "../../model/entity/users/driver/driver";
import {Element} from "../../model/entity/order/element";


export class OrderRepository extends BaseRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);

  private _geocodeService: GeocodeService = new GeocodeService;
	private _orderStatusManger: OrderStatusManager = new OrderStatusManager(this.connection);

  public async getBookingsForMember(member: Member): Promise<Order[]> {

  return await this._orderRepository.find({
	    where: {member: member},
	    relations: [
		    "pickupAddress", "deliveryAddress",
		    "pickupSlot", "deliverySlot", "person"
	    ]
    });
    
  }

  public async createBooking(member: Member, createOrderRequest: DTO.order.CreateOrderRequest): Promise<Order> {

  	if (!member.isActive())
  		throw new exception.InvalidEmailException();

  	let pickupSlot = await this._slotRepository.findOne(createOrderRequest.pickupSlotId);

  	if (!pickupSlot)
  		  throw new exception.SlotNotFoundException(createOrderRequest.pickupSlotId);

  	let deliverySlot = await this._slotRepository.findOne(createOrderRequest.deliverySlotId);

	  if (!deliverySlot)
		  throw new exception.SlotNotFoundException(createOrderRequest.deliverySlotId);

	  let pickupAddress: DTO.address.Address;
	  let deliveryAddress: DTO.address.Address;

	  if (createOrderRequest.pickupAddress.googlePlaceId)
	  	pickupAddress = await this._geocodeService.getAddressWithPlaceId(createOrderRequest.pickupAddress.googlePlaceId);
	  else if (createOrderRequest.pickupAddress.coordinates)
		  pickupAddress = await this._geocodeService.getAddressWithCoordinates(createOrderRequest.pickupAddress.coordinates);
	  else
	  	throw new exception.CannotCreateAddressException;

	  if (!createOrderRequest.deliveryAddress)
	  	  deliveryAddress = pickupAddress;
	  else if (createOrderRequest.deliveryAddress.googlePlaceId)
		  deliveryAddress = await this._geocodeService.getAddressWithPlaceId(createOrderRequest.deliveryAddress.googlePlaceId);
	  else if (createOrderRequest.deliveryAddress.coordinates)
		  deliveryAddress = await this._geocodeService.getAddressWithCoordinates(createOrderRequest.deliveryAddress.coordinates);
	  else
		  throw new exception.CannotCreateAddressException;

	  let pickupAddressEntity = Address.create(pickupAddress);
	  let deliveryAddressEntity = deliveryAddress != pickupAddress ? Address.create(deliveryAddress) : pickupAddressEntity;

	  let order = await Order.create({
		  member: member, pickupSlot: pickupSlot, deliverySlot: deliverySlot,
		  pickupAddress: pickupAddressEntity, deliveryAddress: deliveryAddressEntity
	  });
	  order.elements = createOrderRequest.elements.map(element => Element.create(order, element));

	  await this._addressRepository.insert(pickupAddressEntity);
	  if (deliveryAddress !== pickupAddress)
		  await this._addressRepository.insert(deliveryAddressEntity);

	  await this._orderRepository.insert(order);

	  this._orderStatusManger.registerOrderCreation(order)
		  .then(() => console.warn(`Started Tracking Booking ${order}`));

	  return order;

  }

  public async assignDriverToOrder(order: Order, driver: Driver): Promise<void> {

  	order.driver = driver;
  	await this._orderRepository.save(order);

  }
  

}