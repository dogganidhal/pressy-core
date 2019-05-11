import {Order, OrderMission, OrderMissionType} from '../../model/entity/order';
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
import { LaundryPartner } from '../../model/entity/users/laundry';
import { DateUtils } from '../../utils';


export class OrderRepositoryImpl extends BaseRepository implements IOrderRepository {

  private _orderRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);
	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);
	private _orderMissionRepository: Repository<OrderMission> = this.connection.getRepository(OrderMission);

	private _orderStatusManger: IOrderStatusRepository = RepositoryFactory.instance.orderStatusRepository;

  public async getOrdersForMember(member: Member): Promise<Order[]> {

  return await this._orderRepository.find({
	    where: {member: member},
	    relations: [
		    "address", "pickupSlot", "deliverySlot",
		    "member", "member.person", "items"
	    ]
    });
    
  }

  public async createOrder(order: Order): Promise<Order> {

	  order = await this._orderRepository.save(order);
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

	public async editOrder(editOrderRequest: EditOrderRequestDto): Promise<Order> {

		let order = await this._orderRepository.findOne(editOrderRequest.id);

		if (!order)
			throw new exception.OrderNotFoundException(editOrderRequest.id);

		let asyncTasks: PromiseLike<any>[] = [];

		if (editOrderRequest.address) {
			let addressRepository = RepositoryFactory.instance.addressRepository;
			asyncTasks.push(
				Promise.resolve(
					order.address = await addressRepository.createAddress(editOrderRequest.address, undefined)
				)
			);
		}

		if (editOrderRequest.pickupSlot) {
			let slotRepository = RepositoryFactory.instance.slotRepository;
			asyncTasks.push(
				Promise.resolve(
					order.pickupSlot = await slotRepository.createSlot(order.pickupSlot)
				)
			);
		}
		
		if (editOrderRequest.deliverySlot) {
			let slotRepository = RepositoryFactory.instance.slotRepository;
			asyncTasks.push(
				Promise.resolve(
					order.deliverySlot = await slotRepository.createSlot(order.deliverySlot)
				)
			);
		}

		if (editOrderRequest.memberId) {
			let memberRepository = RepositoryFactory.instance.memberRepository;
			let member = await memberRepository.getMemberById(editOrderRequest.memberId);
			if (!member)
				throw new exception.MemberNotFoundException(editOrderRequest.memberId);
			order.member = member;
		}

		await Promise.all(asyncTasks);

		order.type = editOrderRequest.type || order.type;

		return await this._orderRepository.save(order);

	}

	public async setOrderItemCount(order: Order, itemCount: number): Promise<Order> {
		order.itemCount = itemCount;
		return await this._orderRepository.save(order);
	}

	public async getOrderById(id: number): Promise<Order | undefined> {
		return this._orderRepository.findOne(id, {
			relations: [
				"pickupSlot", "deliverySlot", "address", "member",
				"member.person", "member.addresses", "paymentAccount"
			]
		});
	}

	public async getTodayOrdersByLaundryPartner(partner: LaundryPartner): Promise<Order[]> {

		let now = new Date(Date.now());
		let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
		let tomorrowDate = DateUtils.addDays(todayDate, 1);
		// TODO: Find a better way to filter on the orders in the db directly
		let orders = await this._orderRepository.find({
			where: {
				laundryPartner: {
					id: partner.id,
				},
				// pickupSlot: {
				// 	startDate: Between(todayDate, tomorrowDate)
				// }
			},
			relations: [
				"pickupSlot", "deliverySlot", "address", "member",
				"member.person", "member.addresses"
			]
		});
		return orders
			.filter(order => order.pickupSlot.startDate >= todayDate && order.pickupSlot.startDate <= tomorrowDate);
		
	}

}