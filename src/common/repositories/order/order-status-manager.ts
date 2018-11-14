import {Connection} from "typeorm";
import {OrderStatusUpdate, OrderStatusUpdateType} from "../../model/entity/status/order-status-update";
import {Order} from "../../model/entity/order";


export class OrderStatusManager {

	private _orderStatusRepository = this.connection.getRepository(OrderStatusUpdate);

	constructor(private connection: Connection) {}

	public async registerOrderCreation(order: Order): Promise<void> {

		let orderStatusUpdate = OrderStatusUpdate.create(order, OrderStatusUpdateType.CREATED);
		await this._orderStatusRepository.insert(orderStatusUpdate);

	}

}