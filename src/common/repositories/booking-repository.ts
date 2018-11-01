import { Booking } from './../model/entity/booking/index';
import { Repository } from "typeorm";
import { Member } from '../model/entity/users/member';
import { ARepository } from '.';


export class BookingRepository extends ARepository {

  private _bookingRepository: Repository<Booking> = this.connection.getRepository(Booking);

  public async saveBooking(booking: Booking): Promise<void> {

    await this._bookingRepository.insert(booking);

  }

  public async getBookingsForMember(member: Member): Promise<Booking[]> {

    const bookings = await this._bookingRepository.find({
      where: {member: member},
      relations: [
        "pickupAddress", "deliveryAddress", 
        "pickupSlot", "deliverySlot", "member",
        "pickupAddress.location", "deliveryAddress.location"
      ]
    });
    return bookings;
    
  }

  

}