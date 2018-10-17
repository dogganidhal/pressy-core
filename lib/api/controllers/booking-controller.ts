import { Path, POST, ContextRequest, GET, QueryParam, Return } from "typescript-rest";
import { Controller, Authenticated } from ".";
import { Request } from "express";
import { Exception } from '../../common/errors';
import { BookingRepository } from '../../common/repositories/booking-repository';
import { SlotRepository } from '../../common/repositories/slot-repository';
import { HTTPUtils } from '../../common/utils/http-utils';
import { JSONSerialization } from '../../common/utils/json-serialization';
import { DateUtils } from '../../common/utils';
import { CreateBookingRequestDTO, BookingDTO } from "../../common/model/dto/booking";
import { Member } from "../../common/model/entity";
import { Booking } from "../../common/model/entity/booking";
import { SlotType } from "../../common/model/entity/order/slot";


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