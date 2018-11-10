import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {Exception} from '../../common/errors';
import {BookingRepository} from '../../common/repositories/booking/booking-repository';
import {SlotRepository} from '../../common/repositories/slot-repository';
import {DateUtils} from '../../common/utils';
import {BookingDTO, CreateBookingRequestDTO} from "../../common/model/dto/booking";
import {Member} from "../../common/model/entity/users/member";
import {Booking} from "../../common/model/entity/booking";
import {SlotType} from "../../common/model/entity/order/slot";
import {ISlot, SlotDTO} from "../../common/model/dto/slot";
import {BaseController} from "./base-controller";
import {Authenticate, JSONResponse} from "../annotations";
import {AddressDTO, IAddress} from "../../common/model/dto/address";
import {IMemberInfo, MemberInfoDTO, MemberRegistrationDTO} from "../../common/model/dto/member";
import {Database} from "../../common/db";
import {Crypto} from "../../common/services/crypto";
import {MemberRepository} from "../../common/repositories/member-repository";
import {HTTP} from "../../common/utils/http";
import {GeocodeService} from "../../common/services/geocode-service";


@Path('/api/v1/booking/')
export class BookingController extends BaseController {

	private _geocodeService = new GeocodeService();

	private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _bookingRepository: BookingRepository = new BookingRepository(Database.getConnection());
  private _slotsRepository: SlotRepository = new SlotRepository(Database.getConnection());

  @JSONResponse
  @Authenticate(Crypto.SigningCategory.MEMBER)
  @POST
  public async createBooking() {

	  const dto = HTTP.parseJSONBody(this.getPendingRequest().body, CreateBookingRequestDTO);
	  const member: Member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);
	  // let bookingDTO: BookingDTO = new BookingDTO()
	  //
	  // await this._bookingRepository.createBooking(member, bookingDTO);

	  return new Return.RequestAccepted("/api/v1/booking");

  }

  @JSONResponse
  @Authenticate(Crypto.SigningCategory.MEMBER)
  @GET
  public async getBookings() {

  	let member = await this._memberRepository.getMemberFromPersonOrFail(this.pendingPerson);
	  let bookings = await this._bookingRepository.getBookingsForMember(member);
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
			  zipCode: booking.pickupAddress.zipCode
		  };
	  	let deliveryAddress: IAddress = booking.deliveryAddress ? {
			  streetNumber: booking.deliveryAddress.streetNumber,
			  streetName: booking.deliveryAddress.streetName,
			  city: booking.deliveryAddress.city,
			  country: booking.deliveryAddress.country,
			  formattedAddress: booking.deliveryAddress.formattedAddress,
			  zipCode: booking.deliveryAddress.zipCode
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