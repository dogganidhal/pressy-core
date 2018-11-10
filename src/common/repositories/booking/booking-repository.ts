import {Booking} from '../../model/entity/booking';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {BaseRepository} from '../base-repository';
import {BookingStatusManager} from "./booking-status-manager";
import * as DTO from "../../model/dto";

export class BookingRepository extends BaseRepository {

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

  public async createBooking(member: Member, dto: DTO.booking.CreateBookingRequest): Promise<Booking> {

	  let booking = await Booking.create(member, dto);

	  await this._bookingRepository.insert(booking);

	  this._bookingStatusManger.registerBookingCreation(booking)
		  .then(() => console.warn(`Started Tracking Booking ${booking}`));

	  return booking;

  }
  

}