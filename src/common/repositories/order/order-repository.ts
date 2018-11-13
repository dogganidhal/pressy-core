import {Order} from '../../model/entity/order';
import {Repository} from "typeorm";
import {Member} from '../../model/entity/users/member';
import {BaseRepository} from '../base-repository';
import {OrderStatusManager} from "./order-status-manager";
import * as DTO from "../../model/dto";
import {Slot} from "../../model/entity/slot";
import {exception} from "../../errors";
import {GeocodeService} from "../../services/geocode-service";
import {Address} from "../../model/entity/common/address";


export class OrderRepository extends BaseRepository {

  private _bookingRepository: Repository<Order> = this.connection.getRepository(Order);
  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
	private _addressRepository: Repository<Address> = this.connection.getRepository(Address);

  private _geocodeService: GeocodeService = new GeocodeService;
	private _bookingStatusManger: OrderStatusManager = new OrderStatusManager(this.connection);

  public async getBookingsForMember(member: Member): Promise<Order[]> {

  return await this._bookingRepository.find({
	    where: {member: member},
	    relations: [
		    "pickupAddress", "deliveryAddress",
		    "pickupSlot", "deliverySlot", "person"
	    ]
    });
    
  }

  public async createBooking(member: Member, createBookingRequest: DTO.order.CreateOrderRequest): Promise<Order> {

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

	  let pickupAddressEntity = Address.create(pickupAddress);
	  let deliveryAddressEntity = deliveryAddress != pickupAddress ? Address.create(deliveryAddress) : pickupAddressEntity;

	  let bookingEntity = await Order.create(
	  	member, pickupSlot, deliverySlot,
		  pickupAddressEntity, deliveryAddressEntity,
		  createBookingRequest.elements
	  );

	  await this._addressRepository.insert(pickupAddressEntity);
	  if (deliveryAddress !== pickupAddress)
		  await this._addressRepository.insert(deliveryAddressEntity);

	  await this._bookingRepository.insert(bookingEntity);

	  this._bookingStatusManger.registerBookingCreation(bookingEntity)
		  .then(() => console.warn(`Started Tracking Booking ${bookingEntity}`));

	  return bookingEntity;

  }
  

}