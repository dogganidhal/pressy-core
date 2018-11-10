import {Booking} from '../../model/entity/booking/index';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {ARepository} from '../index';
import {BookingDTO} from "../../model/dto/booking";
import {BookingStatusManager} from "./booking-status-manager";


export class BookingRepository extends ARepository {

  private _bookingRepository: Repository<Booking> = this.connection.getRepository(Booking);
  private _bookingStatusManger: BookingStatusManager = new BookingStatusManager(this.connection);

  public async getBookingsForMember(member: Member): Promise<Booking[]> {

  return await this._bookingRepository.find({
	    where: {member: member},
	    relations: [
		    "pickupAddress", "deliveryAddress",
		    "pickupSlot", "deliverySlot", "member"
	    ]
    });
    
  }

  public async createBooking(member: Member, dto: BookingDTO): Promise<Booking> {

	  let booking = await Booking.create(member, dto);

	  await this._bookingRepository.insert(booking);

	  this._bookingStatusManger.registerBookingCreation(booking)
		  .then(() => console.warn(`Started Tracking Booking ${booking}`));

	  return booking;

  }
  

}