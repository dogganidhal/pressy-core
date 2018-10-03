import { JsonObject, JsonProperty } from "json2typescript";
import { OrderElementType } from "../entity/order/order-element";
import { OrderType } from "../entity/order";
import { AddressDTO } from "./address";


@JsonObject
export class OrderElementDTO {

  @JsonProperty("order_id", Number, true)
  public orderId?: number = undefined;

  @JsonProperty("type", Number)
  public type: OrderElementType = OrderElementType.PANT;

  @JsonProperty("color", String, true)
  public color: string = "";

  @JsonProperty("comment", String, true)
  public comment?: string = undefined;

}

@JsonObject
export class CreateOrderRequestDTO {

  @JsonProperty("elements", [OrderElementDTO])
  public elements: OrderElementDTO[] = [];

  @JsonProperty("type", Number)
  public type: OrderType = OrderType.LIGHT;

  @JsonProperty("pickup_address", AddressDTO)
  public pickupAddress: AddressDTO = new AddressDTO;

  @JsonProperty("delivery_address", AddressDTO, true)
  public deliveryAddress?: AddressDTO = undefined;

  @JsonProperty("pickup_slot_id", Number)
  public pickupSlotId: number = -1;

  @JsonProperty("delivery_slot_id", Number)
  public deliverySlotId: number = -1;

}