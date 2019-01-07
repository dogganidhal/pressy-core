import { ArticleDto } from "..";
import { OrderItem } from "../../entity/order/order-item";


export class OrderItemDto {

	public orderId: number;
	public element: ArticleDto;
	public color: string;
	public comment?: string;

	constructor(element: OrderItem) {
		this.orderId = element.order.id;
		this.element = new ArticleDto(element.element);
		this.color = element.color;
		this.comment = element.comment;
	}

}