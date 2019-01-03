import { ElementDto } from "..";
import { OrderElement } from "../../entity/order/order-element";


export class OrderElementDto {

	public orderId: number;
	public element: ElementDto;
	public color: string;
	public comment?: string;

	constructor(element: OrderElement) {
		this.orderId = element.order.id;
		this.element = new ElementDto(element.element);
		this.color = element.color;
		this.comment = element.comment;
	}

}