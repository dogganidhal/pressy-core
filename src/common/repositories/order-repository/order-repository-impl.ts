import {Order, Element, OrderMission, OrderMissionType} from '../../model/entity/order';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {BaseRepository} from '../base-repository';
import {Slot} from "../../model/entity/slot";
import {exception} from "../../errors";
import {Address} from "../../model/entity/common/address";
import {Driver} from "../../model/entity/users/driver/driver";
import { CreateOrderRequestDto, AssignOrderDriverRequestDto, EditOrderRequestDto, CreateOrderElementRequest } from '../../model/dto';
import { IOrderRepository } from '.';
import { RepositoryFactory } from '../factory';
import { IOrderStatusRepository } from '../order-status-repository';
import { OrderElement } from '../../model/entity/order/order-element';


export class OrderRepositoryImpl extends BaseRepository implements IOrderRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);
	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);
	private _orderElementRepository: Repository<OrderElement> = this.connection.getRepository(OrderElement);
	private _elementRepository: Repository<Element> = this.connection.getRepository(Element);
	private _orderMissionRepository: Repository<OrderMission> = this.connection.getRepository(OrderMission);

	private _orderStatusManger: IOrderStatusRepository = RepositoryFactory.instance.createOrderStatusRepository();

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

		let addressRepository = RepositoryFactory.instance.createAddressRepository();
	  let addressEntity = await addressRepository.getAddressById(createOrderRequest.addressId);

	  if (!addressEntity)
	  	throw new exception.AddressNotFoundException(createOrderRequest.addressId);

	  let order = await Order.create({
		  member: member, pickupSlot: pickupSlot, deliverySlot: deliverySlot,
			address: await addressRepository.duplicateAddress(addressEntity),
			type: createOrderRequest.type
	  });

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

	public async assignDriverToPickupOrder(request: AssignOrderDriverRequestDto): Promise<void> {

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

		let orderMission = OrderMission.create(OrderMissionType.PICKUP, order, driver);
		await this._orderMissionRepository.save(orderMission);
		
		order.pickupSlot.availableDrivers--;

		await this._orderRepository.save(order);

	}

	public async assignDriverToDeliverOrder(request: AssignOrderDriverRequestDto): Promise<void> {

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

		let orderMission = OrderMission.create(OrderMissionType.DELIVERY, order, driver);
		await this._orderMissionRepository.save(orderMission);

		order.pickupSlot.availableDrivers--;

		await this._orderRepository.save(order);

	}

	public async setOrderElements(order: Order, elements: CreateOrderElementRequest[]): Promise<OrderElement[]> {

		let orderElements: OrderElement[] = [];
		let asyncTasks: PromiseLike<any>[] = [];

		elements.forEach(async element => {
			asyncTasks.push(Promise.resolve(async () => {

				var elementEntity = await this._elementRepository.findOne(element.elementId);
				
				if (!elementEntity)
					throw new exception.ElementNotFound(element.elementId);

				var orderElement = OrderElement.create(order, element, elementEntity);
				orderElements.push(await this._orderElementRepository.save(orderElement))
				
			}));
		});

		await Promise.all(asyncTasks);

		return orderElements;

	}

	public async editOrder(editOrderRequest: EditOrderRequestDto): Promise<Order> {

		let order = await this._orderRepository.findOne(editOrderRequest.id);

		if (!order)
			throw new exception.OrderNotFoundException(editOrderRequest.id);

		let asyncTasks: PromiseLike<any>[] = [];

		if (editOrderRequest.address) {
			let addressRepository = RepositoryFactory.instance.createAddressRepository();
			asyncTasks.push(
				Promise.resolve(
					order.address = await addressRepository.createAddress(editOrderRequest.address, undefined)
				)
			);
		}

		if (editOrderRequest.pickupSlot) {
			let slotRepository = RepositoryFactory.instance.createSlotRepository();
			asyncTasks.push(
				Promise.resolve(
					order.pickupSlot = await slotRepository.createSlot(order.pickupSlot)
				)
			);
		}
		
		if (editOrderRequest.deliverySlot) {
			let slotRepository = RepositoryFactory.instance.createSlotRepository();
			asyncTasks.push(
				Promise.resolve(
					order.deliverySlot = await slotRepository.createSlot(order.deliverySlot)
				)
			);
		}

		if (editOrderRequest.memberId) {
			let memberRepository = RepositoryFactory.instance.createMemberRepository();
			let member = await memberRepository.getMemberById(editOrderRequest.memberId);
			if (!member)
				throw new exception.MemberNotFoundException(editOrderRequest.memberId);
			order.member = member;
		}

		if (editOrderRequest.elements) {
			asyncTasks.push(
				Promise.resolve(
					order.elements = await this.setOrderElements(order, editOrderRequest.elements)
				)
			);
		}

		await Promise.all(asyncTasks);

		order.type = editOrderRequest.type || order.type;

		return await this._orderRepository.save(order);

	}

}