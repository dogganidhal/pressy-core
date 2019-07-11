import { ArticleDto } from "..";
import { OrderItem } from "../../entity/order/order-item";


export class OrderItemDto {

	public id: number;
	public article: ArticleDto;
	public quantity: number;
	public comment?: string;

	constructor(item: OrderItem) {
		this.id = item.id;
		this.article = new ArticleDto(item.article);
		this.quantity = item.quantity;
		this.comment = item.comment;
	}

}