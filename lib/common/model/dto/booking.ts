import { JsonObject, JsonProperty } from "json2typescript";
import { CreateAddressDTO, AddressDTO } from "./address";
import { SlotDTO } from "./slot";
import { MemberInfoDTO } from ".";
import { Booking } from "../entity/booking";


@JsonObject
export class CreateBookingRequestDTO {

  @JsonProperty("pickupSlotId", Number)
  public pickupSlotId: number = -1;

  @JsonProperty("deliverySlotId", Number)
  public deliverySlotId: number = -1;

  @JsonProperty("pickupAddress", CreateAddressDTO)
  public pickupAddress: CreateAddressDTO = new CreateAddressDTO;

  @JsonProperty("deliveryAddress", CreateAddressDTO, true)
  public deliveryAddress?: CreateAddressDTO = undefined;

}

@JsonObject
export class BookingDTO {

  @JsonProperty("id", Number)
  public id: number = -1;

  @JsonProperty("pickupSlot", SlotDTO)
  public pickupSlot: SlotDTO = new SlotDTO;

  @JsonProperty("deliverySlot", SlotDTO)
  public deliverySlot: SlotDTO = new SlotDTO;

  @JsonProperty("pickupAddress", AddressDTO)
  public PickupAddress: AddressDTO = new AddressDTO;

  @JsonProperty("deliveryAddress", AddressDTO)
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