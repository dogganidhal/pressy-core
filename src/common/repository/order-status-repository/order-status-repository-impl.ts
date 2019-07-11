import {Connection} from "typeorm";
import {OrderStatusUpdate, OrderStatusUpdateType} from "../../model/entity/status/order-status-update";
import {Order} from "../../model/entity/order";
import {Driver} from "../../model/entity/users/driver/driver";
import { IOrderStatusRepository } from ".";
import { UpdateOrderRequestDto } from "../../model/dto/order/update-order";
import { exception } from "../../errors";
import { User } from "../../model/entity/users";
import { StatusUpdateDoerIdentity } from "../../model/entity/status";
import { NotImplementedError } from "typescript-rest/dist/server-errors";


export class OrderStatusRepositoryImpl implements IOrderStatusRepository {

	private _orderStatusRepository = this.connection.getRepository(OrderStatusUpdate);
	private _orderRepository = this.connection.getRepository(Order);

	constructor(private connection: Connection) {}

	public async registerOrderCreation(order: Order): Promise<void> {
		let orderStatusUpdate = OrderStatusUpdate.create(order, OrderStatusUpdateType.CREATED);
		await this._orderStatusRepository.insert(orderStatusUpdate);
	}

	public async assignDriverToOrder(order: Order, driver: Driver): Promise<void> {
		throw new NotImplementedError;
	}

	public async updateOrderStatus(doer: User, request: UpdateOrderRequestDto): Promise<void> {

		let order = await this._orderRepository.findOne(request.id);

		if (!order)
			throw new exception.OrderNotFoundException(request.id);

		let statusUpdate = OrderStatusUpdate.create(
			order, 
			OrderStatusUpdateType.fromString(request.reason), 
			doer.person, 
			StatusUpdateDoerIdentity.fromUser(doer),
			typeof(request.payload) === "string" ? request.payload : JSON.stringify(request.payload)
		);
		
		this._orderStatusRepository.insert(statusUpdate);

	}

}