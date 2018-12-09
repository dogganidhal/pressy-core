import {Order} from '../../model/entity/order';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member/member';
import {BaseRepository} from '../base-repository';
import {OrderStatusManager} from "./order-status-manager";
import {Slot} from "../../model/entity/slot";
import {exception} from "../../errors";
import {GeocodeService} from "../../../services/geocode-service";
import {Address} from "../../model/entity/common/address";
import {Driver} from "../../model/entity/users/driver/driver";
import {Element} from "../../model/entity/order/element";
import { CreateOrderRequest, AssignOrderDriverRequest, Address as AddressDTO } from '../../model/dto';


export class OrderRepository extends BaseRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);
	private _elementRepository: Repository<Element> = this.connection.getRepository(Element);
	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);

  private _geocodeService: GeocodeService = new GeocodeService;
	private _orderStatusManger: OrderStatusManager = new OrderStatusManager(this.connection);

  public async getOrdersForMember(member: Member): Promise<Order[]> {

  return await this._orderRepository.find({
	    where: {member: member},
	    relations: [
		    "pickupAddress", "deliveryAddress",
		    "pickupSlot", "deliverySlot",
		    "member", "member.person",
		    "elements"
	    ]
    });
    
  }

  public async createOrder(member: Member, createOrderRequest: CreateOrderRequest): Promise<Order> {

  	if (!member.isActive())
  		throw new exception.InactiveMemberException(member);

  	if (createOrderRequest.elements.length === 0)
  		throw new exception.EmptyOrderException;

  	let pickupSlot = await this._slotRepository.findOne(createOrderRequest.pickupSlotId);

  	if (!pickupSlot)
  		  throw new exception.SlotNotFoundException(createOrderRequest.pickupSlotId);

  	let deliverySlot = await this._slotRepository.findOne(createOrderRequest.deliverySlotId);

	  if (!deliverySlot)
		  throw new exception.SlotNotFoundException(createOrderRequest.deliverySlotId);

	  let pickupAddress: AddressDTO;
	  let deliveryAddress: AddressDTO;

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

	  let elements = createOrderRequest.elements.map(element => {
		  let e = Element.create(order, element);
		  e.order = order;
		  return e;
	  });

	  order.elements = elements;

	  await this._addressRepository.insert(pickupAddressEntity);

	  if (deliveryAddress !== pickupAddress)
		  await this._addressRepository.insert(deliveryAddressEntity);

	  await this._orderRepository.insert(order);
	  await this._elementRepository.insert(elements);
	  this._orderStatusManger.registerOrderCreation(order);

	  return order;

  }

	public async assignDriverToOrder(request: AssignOrderDriverRequest): Promise<void> {

		let {driverId, orderId} = request;

		let driver: Driver | undefined;
		let order: Order | undefined;
		
		await Promise.all([
			driver = await this._driverRepository.findOne(driverId),
			order = await this._orderRepository.findOne(orderId)
		]);

		if (!driver)
			throw new exception.DriverNotFoundException(driverId);

		if (!order)
			throw new exception.OrderNotFoundException(orderId);

		order.driver = driver;

		await this._orderRepository.save(order);

	}

}