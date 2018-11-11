import {Booking} from '../../model/entity/booking';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {BaseRepository} from '../base-repository';
import {BookingStatusManager} from "./booking-status-manager";
import * as DTO from "../../model/dto";
import {Slot} from "../../model/entity/order/slot";
import {exception} from "../../errors";
import {GeocodeService} from "../../services/geocode-service";


export class BookingRepository extends BaseRepository {

  private _bookingRepository: Repository<Booking> = this.connection.getRepository(Booking);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);

  private _geocodeService: GeocodeService = new GeocodeService;
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

  public async createBooking(member: Member, createBookingRequest: DTO.booking.CreateBookingRequest): Promise<Booking> {

  	let pickupSlot = await this._slotRepository.findOne(createBookingRequest.pickupSlotId);

  	if (!pickupSlot)
  		  throw new exception.SlotNotFoundException(createBookingRequest.pickupSlotId);

  	let deliverySlot = await this._slotRepository.findOne(createBookingRequest.deliverySlotId);

	  if (!deliverySlot)
		  throw new exception.SlotNotFoundException(createBookingRequest.deliverySlotId);

	  let pickupAddress: DTO.address.Address;
	  let deliveryAddress: DTO.address.Address;

	  if (createBookingRequest.pickupAddress.googlePlaceId)
	  	pickupAddress = await this._geocodeService.getAddressWithPlaceId(createBookingRequest.pickupAddress.googlePlaceId);
	  else if (createBookingRequest.pickupAddress.coordinates)
		  pickupAddress = await this._geocodeService.getAddressWithCoordinates(createBookingRequest.pickupAddress.coordinates);
	  else
	  	throw new exception.CannotCreateAddressException;

	  if (!createBookingRequest.deliveryAddress)
	  	  deliveryAddress = pickupAddress;
	  else if (createBookingRequest.deliveryAddress.googlePlaceId)
		  deliveryAddress = await this._geocodeService.getAddressWithPlaceId(createBookingRequest.deliveryAddress.googlePlaceId);
	  else if (createBookingRequest.deliveryAddress.coordinates)
		  deliveryAddress = await this._geocodeService.getAddressWithCoordinates(createBookingRequest.deliveryAddress.coordinates);
	  else
		  throw new exception.CannotCreateAddressException;

	  let bookingEntity = await Booking.create(
	  	member, pickupSlot, deliverySlot,
		  pickupAddress, deliveryAddress
	  );

	  await this._bookingRepository.insert(bookingEntity);

	  this._bookingStatusManger.registerBookingCreation(bookingEntity)
		  .then(() => console.warn(`Started Tracking Booking ${bookingEntity}`));

	  return bookingEntity;

  }
  

}