import {Connection} from "typeorm";
import {OrderStatusUpdate, OrderStatusUpdateType} from "../../model/entity/status/order-status-update";
import {Order} from "../../model/entity/order";
import {Driver} from "../../model/entity/users/driver/driver";


export class OrderStatusManager {

	private _orderStatusRepository = this.connection.getRepository(OrderStatusUpdate);

	constructor(private connection: Connection) {}

	public async registerOrderCreation(order: Order): Promise<void> {

		let orderStatusUpdate = OrderStatusUpdate.create(order, OrderStatusUpdateType.CREATED);
		await this._orderStatusRepository.insert(orderStatusUpdate);

	}

	public async assignDriverToOrder(order: Order, driver: Driver): Promise<void> {

		let orderStatusUpdate = OrderStatusUpdate.create(order, OrderStatusUpdateType.ASSIGNED_TO_DRIVER);
		await this._orderStatusRepository.insert(orderStatusUpdate);

	}

}