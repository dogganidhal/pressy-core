import {Order, Article, OrderMission, OrderMissionType} from '../../model/entity/order';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {BaseRepository} from '../base-repository';
import {Slot} from "../../model/entity/slot";
import {exception} from "../../errors";
import {Address} from "../../model/entity/common/address";
import {Driver} from "../../model/entity/users/driver/driver";
import { CreateOrderRequestDto, AssignOrderDriverRequestDto, EditOrderRequestDto, CreateOrderItemRequest } from '../../model/dto';
import { IOrderRepository } from '.';
import { RepositoryFactory } from '../factory';
import { IOrderStatusRepository } from '../order-status-repository';
import { OrderItem } from '../../model/entity/order/order-item';


export class OrderRepositoryImpl extends BaseRepository implements IOrderRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);
	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);
	private _orderItemRepository: Repository<OrderItem> = this.connection.getRepository(OrderItem);
	private _articleRepository: Repository<Article> = this.connection.getRepository(Article);
	private _orderMissionRepository: Repository<OrderMission> = this.connection.getRepository(OrderMission);

	private _orderStatusManger: IOrderStatusRepository = RepositoryFactory.instance.createOrderStatusRepository();

  public async getOrdersForMember(member: Member): Promise<Order[]> {

  return await this._orderRepository.find({
	    where: {member: member},
	    relations: [
		    "address",
		    "pickupSlot", "deliverySlot",
		    "member", "member.person",
		    "items"
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
			driver = await this._driverRepository.findOne(driverId, {relations: ["person"]}),
			order = await this._orderRepository.findOne(orderId, {
				relations: [
					"pickupSlot", "deliverySlot", "address", "member", 
					"member.person", "member.addresses"
				]
			})
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
			order = await this._orderRepository.findOne(orderId, {
				relations: [
					"pickupSlot", "deliverySlot", "address", "member", 
					"member.person", "member.addresses"
				]
			})
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

	public async setOrderItems(order: Order, items: CreateOrderItemRequest[]): Promise<OrderItem[]> {

		let orderItems: OrderItem[] = [];
		let asyncTasks: PromiseLike<any>[] = [];

		items.forEach(async items => {
			asyncTasks.push(Promise.resolve(async () => {

				var itemEntity = await this._articleRepository.findOne(items.itemId);
				
				if (!itemEntity)
					throw new exception.ArticleNotFound(items.itemId);

				var orderItem = OrderItem.create(order, items, itemEntity);
				orderItems.push(await this._orderItemRepository.save(orderItem))
				
			}));
		});

		await Promise.all(asyncTasks);

		return orderItems;

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

		if (editOrderRequest.items) {
			asyncTasks.push(
				Promise.resolve(
					order.items = await this.setOrderItems(order, editOrderRequest.items)
				)
			);
		}

		await Promise.all(asyncTasks);

		order.type = editOrderRequest.type || order.type;

		return await this._orderRepository.save(order);

	}

	public async setOrderItemCount(order: Order, itemCount: number): Promise<Order> {
		order.itemCount = itemCount;
		return await this._orderRepository.save(order);
	}

}