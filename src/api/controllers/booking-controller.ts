import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {Exception} from '../../common/errors';
import {BookingRepository} from '../../common/repositories/booking-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {DateUtils} from '../../common/utils';
import {BookingDTO, CreateBookingRequestDTO} from "../../common/model/dto/booking";
import {Member} from "../../common/model/entity/users/member";
import {Booking} from "../../common/model/entity/booking";
import {SlotType} from "../../common/model/entity/order/slot";
import {SlotDTO} from "../../common/model/dto/slot";
import {getConnection} from "typeorm";
import {BaseController} from "./base-controller";
import {Authenticate} from "../annotations/authenticate";
import {JSONResponse} from "../annotations/json-response";


@Path('/api/v1/booking/')
export class BookingController extends BaseController {

  private _bookingRepository: BookingRepository = new BookingRepository(getConnection());
  private _slotsRepository: SlotRepository = new SlotRepository(getConnection());

  @JSONResponse
  @Authenticate()
  @POST
  public async createBooking() {

	  const createBookingRequestDTO = this.getPendingRequest().body as CreateBookingRequestDTO;
	  const member: Member = this.pendingMember!;
	  const booking = await Booking.create(member, createBookingRequestDTO);

	  await this._bookingRepository.saveBooking(booking);

	  return new Return.RequestAccepted("/api/v1/booking");


  }

  @JSONResponse
  @Authenticate()
  @GET
  public async getBookings() {

	  const bookings = await this._bookingRepository.getBookingsForMember(this.pendingMember!);
	  return bookings.map(booking => BookingDTO.create(booking));

  }

  @JSONResponse
  @Path("/slots")
  @GET
  public async getSlots(
    @QueryParam("types") typeString: string, 
    @QueryParam("from") from: string = DateUtils.now().toISOString(),
    @QueryParam("to") to: string = DateUtils.addDaysFromNow(7).toISOString()
  ) {

	  const types = this._parseSlotTypesFromString(typeString);
    const startDate = new Date(from);
	  const endDate = new Date(to);

    if (isNaN(startDate.getTime()))
      throw new Exception.InvalidDateException(from);

    if (isNaN(endDate.getTime()))
	    throw new Exception.InvalidDateException(to);

    const slots = await this._slotsRepository.searchSlots(types, startDate, endDate);

	  return slots.map(slot => SlotDTO.create(slot));

  }

  private _parseSlotTypesFromString(string: string): SlotType[] {
    const types: SlotType[] = string.split(",").map(char => {
      const type = parseInt(char);
      if (type < SlotType.LIGHT || type > SlotType.EXPRESS) {
	      throw new Exception.InvalidSlotTypeException(type);
      }
      return type;
    });
    return types.filter((type, index) => types.indexOf(type) == index);
  }

}