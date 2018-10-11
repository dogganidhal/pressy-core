import { BookingDTO } from './../model/dto/booking';
import { BookingRepository } from './../repositories/booking-repository';
import { Booking } from './../model/entity/booking/index';
import { Path, POST, ContextRequest, GET, QueryParam, Return } from "typescript-rest";
import { Controller, Authenticated } from ".";
import { Request } from "express";
import { Member } from '../model/entity';
import { HTTPUtils } from '../utils/http-utils';
import { CreateBookingRequestDTO } from '../model/dto/booking';
import { DateUtils } from '../utils';
import { SlotRepository } from '../repositories/slot-repository';
import { Exception } from '../errors';
import { SlotType } from '../model/entity/order/slot';
import { JSONSerialization } from '../utils/json-serialization';


@Path('/api/v1/booking/')
export class BookingController extends Controller {

  private _bookingRepository: BookingRepository = BookingRepository.instance;

  @Authenticated()
  @POST
  public async createBooking(@ContextRequest request: Request) {

    try {

      const createBookingRequestDTO = HTTPUtils.parseBody(request.body, CreateBookingRequestDTO);
      const member: Member = this.currentMember!;
      const booking = await Booking.create(member, createBookingRequestDTO);

      this._bookingRepository.saveBooking(booking);

      return new Return.RequestAccepted("/api/v1/booking");

    } catch (error) {
      this.throw(error);
    }

  }

  @Authenticated()
  @GET
  public async getBookings() {

    try {

      const bookings = await this._bookingRepository.getBookingsForMember(this.currentMember!);

      const bookingDTOs = bookings.map(booking => BookingDTO.create(booking));

      return JSONSerialization.serializeObject(bookingDTOs);

    } catch (error) {
      console.log(error);
      this.throw(error);
    }

  }

  @Path("/slots")
  @GET
  public async getSlots(
    @QueryParam("type") type: number = SlotType.LIGHT, 
    @QueryParam("from") from: string = DateUtils.now().toISOString(),
    @QueryParam("to") to: string = DateUtils.addDaysFromNow(7).toISOString()
  ) {

    if (type < SlotType.LIGHT || type > SlotType.EXPRESS)
      this.throw(new Exception.InvalidSlotType(type))

    const slots = await SlotRepository.instance.searchSlots(type, new Date(from), new Date(to));

    return slots;

  }

}