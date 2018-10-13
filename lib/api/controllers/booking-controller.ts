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
  private _slotsRepository: SlotRepository = SlotRepository.instance;

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
    @QueryParam("types") typeString: string, 
    @QueryParam("from") from: string = DateUtils.now().toISOString(),
    @QueryParam("to") to: string = DateUtils.addDaysFromNow(7).toISOString()
  ) {

    var types: SlotType[];

    try {
      types = this._parseSlotTypesFromString(typeString);
    } catch (invalidSlotType) {
      this.throw(new Exception.InvalidSlotType(invalidSlotType));
      return;
    }

    const startDate = new Date(from);

    if (isNaN(startDate.getTime())) {
      this.throw(new Exception.InvalidDate(from));
      return;
    }

    const endDate = new Date(to);

    if (isNaN(endDate.getTime())) {
      this.throw(new Exception.InvalidDate(to));
      return;
    }

    const slots = await this._slotsRepository.searchSlots(types, startDate, endDate);

    return slots;

  }

  private _parseSlotTypesFromString(string: string): SlotType[] {
    const types: SlotType[] = string.split(",").map(char => {
      const type = parseInt(char);
      if (type < SlotType.LIGHT || type > SlotType.EXPRESS) {
        throw type;
      }
      return type;
    });
    return types.filter((type, index) => types.indexOf(type) == index);
  }

}