import { ElementType } from "../entity/order/order-element";

export interface IOrderElement {
  bookingId: number;
	type: ElementType;
	color: string;
	comment?: string;
}

export class OrderElementDTO {

  public bookingId: number;
  public type: ElementType;
  public color: string;
  public comment?: string;

  constructor(element: IOrderElement) {
    this.bookingId = element.bookingId;
	  this.type = element.type;
	  this.color = element.color;
	  this.comment = element.comment;
  }

}

interface ICreateOrderRequest {
	elements: IOrderElement[];
	bookingId: number;
}

export class CreateOrderRequestDTO {

  public elements: OrderElementDTO[];
  public bookingId: number;

  constructor(request: ICreateOrderRequest) {
    this.bookingId = request.bookingId;
    this.elements = request.elements.map(element => new OrderElementDTO(element));
  }

}