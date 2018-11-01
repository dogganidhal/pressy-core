import { CreateAddressDTO, AddressDTO } from "./address";
import { SlotDTO } from "./slot";
import { MemberInfoDTO } from "./member";
import { Booking } from "../entity/booking";


export class CreateBookingRequestDTO {

  public pickupSlotId: number = -1;
  public deliverySlotId: number = -1;
  public pickupAddress: CreateAddressDTO = new CreateAddressDTO;
  public deliveryAddress?: CreateAddressDTO = undefined;

}

export class BookingDTO {

  public id: number = -1;
  public pickupSlot: SlotDTO = new SlotDTO;
  public deliverySlot: SlotDTO = new SlotDTO;
  public PickupAddress: AddressDTO = new AddressDTO;
  public deliveryAddress: AddressDTO = new AddressDTO;
  public member: MemberInfoDTO = new MemberInfoDTO;

  public static create(booking: Booking): BookingDTO {

    const bookingDTO = new BookingDTO;

    bookingDTO.PickupAddress = AddressDTO.create(booking.pickupAddress);
    bookingDTO.deliveryAddress = AddressDTO.create(booking.deliveryAddress || booking.pickupAddress);
    bookingDTO.pickupSlot = SlotDTO.create(booking.pickupSlot);
    bookingDTO.deliverySlot = SlotDTO.create(booking.deliverySlot);
    bookingDTO.member = MemberInfoDTO.create(booking.member);
    bookingDTO.id = booking.id;

    return bookingDTO;

  }

}