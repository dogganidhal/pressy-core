import {CreateAddressDTO, AddressDTO, ICreateAddress, IAddress} from "./address";
import {ISlot, SlotDTO} from "./slot";
import {IMemberInfo, MemberInfoDTO} from "./member";
import {Required} from "../../annotations";

export interface ICreateBookingRequest {
	pickupSlotId: number;
	deliverySlotId: number;
	pickupAddress: ICreateAddress;
	deliveryAddress?: ICreateAddress;
}

export class CreateBookingRequestDTO {

	@Required
  public pickupSlotId: number;

	@Required
  public deliverySlotId: number;

	@Required
  public pickupAddress: CreateAddressDTO;

	@Required
  public deliveryAddress?: CreateAddressDTO;

}

export interface IBooking {
	id: number;
	pickupSlot: ISlot;
	deliverySlot: ISlot;
	pickupAddress: IAddress;
	deliveryAddress: IAddress;
	member: IMemberInfo;
}

export class BookingDTO {

  public id: number;
  public pickupSlot: SlotDTO;
  public deliverySlot: SlotDTO;
  public PickupAddress: AddressDTO;
  public deliveryAddress: AddressDTO;
  public member: MemberInfoDTO;

  constructor(booking: IBooking) {
    this.id = booking.id;
    this.pickupSlot = new SlotDTO(booking.pickupSlot);
    this.deliverySlot = new SlotDTO(booking.pickupSlot);
    this.PickupAddress = new AddressDTO(booking.pickupAddress);
	  this.deliveryAddress = new AddressDTO(booking.deliveryAddress);
	  this.member = new MemberInfoDTO(booking.member);
  }

}