import {Connection} from "typeorm";
import {OrderStatusUpdate, OrderStatusUpdateType} from "../../model/entity/status/order-status-update";
import {Order} from "../../model/entity/order";


export class OrderStatusManager {

	private _bookingStatusRepository = this.connection.getRepository(OrderStatusUpdate);

	constructor(private connection: Connection) {}

	public async registerBookingCreation(booking: Order): Promise<void> {

		let bookingStatusUpdate = OrderStatusUpdate.create(booking, OrderStatusUpdateType.CREATED);
		await this._bookingStatusRepository.insert(bookingStatusUpdate);

	}

}