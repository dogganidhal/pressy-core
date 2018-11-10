import {Connection} from "typeorm";
import {BookingStatusUpdate, BookingStatusUpdateType} from "../../model/entity/status/booking-status-update";
import {Booking} from "../../model/entity/booking";


export class BookingStatusManager {

	private _bookingStatusRepository = this.connection.getRepository(BookingStatusUpdate);

	constructor(private connection: Connection) {}

	public async registerBookingCreation(booking: Booking): Promise<void> {

		let bookingStatusUpdate = BookingStatusUpdate.create(booking, BookingStatusUpdateType.CREATED);
		await this._bookingStatusRepository.insert(bookingStatusUpdate);

	}

}