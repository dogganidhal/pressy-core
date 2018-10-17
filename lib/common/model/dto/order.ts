import { JsonObject, JsonProperty } from "json2typescript";
import { OrderElementType } from "../entity/order/order-element";
import { AddressDTO } from "./address";


@JsonObject
export class OrderElementDTO {

  @JsonProperty("orderId", Number, true)
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

  @JsonProperty("bookingId", Number)
  public bookingId: number = -1;

}