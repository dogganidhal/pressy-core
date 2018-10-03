import { JsonObject, JsonProperty } from "json2typescript";
import { CreateAddressDTO } from "./address";


@JsonObject
export class CreateBookingRequestDTO {

  @JsonProperty("pickup_slot_id", Number)
  public pickupSlotId: number = -1;

  @JsonProperty("delivery_slot_id", Number)
  public deliverySlotId: number = -1;

  @JsonProperty("pickup_address", CreateAddressDTO)
  public pickupAddress: CreateAddressDTO = new CreateAddressDTO;

  @JsonProperty("delivery_address", CreateAddressDTO)
  public deliveryAddress: CreateAddressDTO = new CreateAddressDTO;

}