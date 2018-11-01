import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {Exception} from '../../common/errors';
import {BookingRepository} from '../../common/repositories/booking-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {DateUtils} from '../../common/utils';
import {BookingDTO, CreateBookingRequestDTO} from "../../common/model/dto/booking";
import {Member} from "../../common/model/entity/users/member";
import {Booking} from "../../common/model/entity/booking";
import {SlotType} from "../../common/model/entity/order/slot";
import {ISlot, SlotDTO} from "../../common/model/dto/slot";
import {getConnection} from "typeorm";
import {BaseController} from "./base-controller";
import {Authenticate} from "../annotations/authenticate";
import {JSONResponse} from "../annotations/json-response";
import {IAddress} from "../../common/model/dto/address";
import {IMemberInfo} from "../../common/model/dto/member";


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
	  return bookings.map(booking => {

	  	let pickupSlot: ISlot = {
	  		id: booking.pickupSlot.id,
			  startDate: booking.pickupSlot.startDate,
			  type: booking.pickupSlot.type
		  };
	  	let deliverySlot: ISlot = {
			  id: booking.deliverySlot.id,
			  startDate: booking.deliverySlot.startDate,
			  type: booking.deliverySlot.type
		  };
	  	let pickupAddress: IAddress = {
	  		streetNumber: booking.pickupAddress.streetNumber,
			  streetName: booking.pickupAddress.streetName,
			  city: booking.pickupAddress.city,
			  country: booking.pickupAddress.country,
			  formattedAddress: booking.pickupAddress.formattedAddress,
			  zipCode: booking.pickupAddress.zipCode,
			  location: (booking.pickupAddress.location.latitude && booking.pickupAddress.location.longitude) ? {
				  latitude: booking.pickupAddress.location.latitude!,
				  longitude: booking.pickupAddress.location.longitude!
			  } : undefined
		  };
	  	let deliveryAddress: IAddress = booking.deliveryAddress ? {
			  streetNumber: booking.deliveryAddress.streetNumber,
			  streetName: booking.deliveryAddress.streetName,
			  city: booking.deliveryAddress.city,
			  country: booking.deliveryAddress.country,
			  formattedAddress: booking.deliveryAddress.formattedAddress,
			  zipCode: booking.deliveryAddress.zipCode,
			  location: (booking.deliveryAddress.location.latitude && booking.deliveryAddress.location.longitude) ? {
				  latitude: booking.deliveryAddress.location.latitude!,
				  longitude: booking.deliveryAddress.location.longitude!
			  } : undefined
		  } : pickupAddress;
	  	let member: IMemberInfo = {
			  id: booking.member.id,
			  firstName: booking.member.person.firstName,
			  lastName: booking.member.person.lastName,
			  email: booking.member.person.email,
			  phone: booking.member.person.phone,
			  created: booking.member.person.created
		  };

	  	return new BookingDTO({
			  pickupSlot: pickupSlot, pickupAddress: pickupAddress,
			  deliverySlot: deliverySlot, deliveryAddress: deliveryAddress,
			  member: member, id: booking.id
		  })


	  });

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

	  return slots.map(slot => new SlotDTO(slot));

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