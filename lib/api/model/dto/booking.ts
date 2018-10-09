import { JsonObject, JsonProperty } from "json2typescript";
import { CreateAddressDTO, AddressDTO } from "./address";
import { SlotDTO } from "./slot";
import { MemberInfoDTO } from ".";
import { Booking } from "../entity/booking";


@JsonObject
export class CreateBookingRequestDTO {

  @JsonProperty("pickup_slot_id", Number)
  public pickupSlotId: number = -1;

  @JsonProperty("delivery_slot_id", Number)
  public deliverySlotId: number = -1;

  @JsonProperty("pickup_address", CreateAddressDTO)
  public pickupAddress: CreateAddressDTO = new CreateAddressDTO;

  @JsonProperty("delivery_address", CreateAddressDTO, true)
  public deliveryAddress?: CreateAddressDTO = undefined;

}

@JsonObject
export class BookingDTO {

  @JsonProperty("id", Number)
  public id: number = -1;

  @JsonProperty("pickup_slot", SlotDTO)
  public pickupSlot: SlotDTO = new SlotDTO;

  @JsonProperty("delivery_slot", SlotDTO)
  public deliverySlot: SlotDTO = new SlotDTO;

  @JsonProperty("pickup_address", AddressDTO)
  public PickupAddress: AddressDTO = new AddressDTO;

  @JsonProperty("delivery_address", AddressDTO)
  public deliveryAddress: AddressDTO = new AddressDTO;

  @JsonProperty("member", MemberInfoDTO)
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