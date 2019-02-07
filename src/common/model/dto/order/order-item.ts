import { ArticleDto } from "..";
import { OrderItem } from "../../entity/order/order-item";


export class OrderItemDto {

	public orderId: number;
	public article: ArticleDto;
	public color: string;
	public comment?: string;

	constructor(item: OrderItem) {
		this.orderId = item.order.id;
		this.article = new ArticleDto(item.article);
		this.color = item.color;
		this.comment = item.comment;
	}

}