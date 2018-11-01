import { ElementType } from "../entity/order/order-element";


export class OrderElementDTO {

  public orderId?: number = undefined;
  public type: ElementType = ElementType.PANT;
  public color: string = "";
  public comment?: string = undefined;

}

export class CreateOrderRequestDTO {

  public elements: OrderElementDTO[] = [];
  public bookingId: number = -1;

}