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
import { CreateOrderRequestDto, AssignOrderDriverRequestDto, AddressDto as AddressDTO } from '../../model/dto';
import {AddressRepository} from "../address-repository";


export class OrderRepository extends BaseRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);
	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);

	private _orderStatusManger: OrderStatusManager = new OrderStatusManager(this.connection);

  public async getOrdersForMember(member: Member): Promise<Order[]> {

  return await this._orderRepository.find({
	    where: {member: member},
	    relations: [
		    "address", "deliveryAddress",
		    "pickupSlot", "deliverySlot",
		    "member", "member.person",
		    "elements"
	    ]
    });
    
  }

  public async createOrder(member: Member, createOrderRequest: CreateOrderRequestDto): Promise<Order> {

  	if (!member.isActive())
  		throw new exception.InactiveMemberException(member);

  	let pickupSlot = await this._slotRepository.findOne(createOrderRequest.pickupSlotId);

  	if (!pickupSlot)
  		  throw new exception.SlotNotFoundException(createOrderRequest.pickupSlotId);

  	let deliverySlot = await this._slotRepository.findOne(createOrderRequest.deliverySlotId);

	  if (!deliverySlot)
		  throw new exception.SlotNotFoundException(createOrderRequest.deliverySlotId);

	  let addressRepository = new AddressRepository(this.connection);
	  let addressEntity = await addressRepository.getAddressById(createOrderRequest.addressId);

	  if (!addressEntity)
	  	throw new exception.AddressNotFoundException(createOrderRequest.addressId);

	  let order = await Order.create({
		  member: member, pickupSlot: pickupSlot, deliverySlot: deliverySlot,
		  address: await addressRepository.duplicateAddress(addressEntity)
	  });

	  deliverySlot.availableDrivers--;
	  pickupSlot.availableDrivers--;

	  await Promise.all([
			await this._slotRepository.save(deliverySlot),
			await this._slotRepository.save(pickupSlot),
			await this._addressRepository.insert(addressEntity)
		]);

	  await this._orderRepository.insert(order);
	  this._orderStatusManger.registerOrderCreation(order);

	  return order;

	}

  public async getOrders(pageLength: number = 0, offset: number = 0): Promise<Order[]> {
  	return this._orderRepository.find({
			take: pageLength, 
			skip: offset, 
			relations: [
				"pickupSlot", "deliverySlot", "address", "member", 
				"member.person", "driver", "driver.person", "member.addresses"
			]
		});
	}

	public async assignDriverToOrder(request: AssignOrderDriverRequestDto): Promise<void> {

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