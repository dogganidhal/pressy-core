import {Required} from "../../../annotations";

export class CreateOrderItemDto {

	@Required()
	public articleId: number;
	@Required()
	public quantity: number;
	public comment?: string;

}

export class TerminateOrderRequest {

	@Required()
	public orderId: number;
	public orderItems: CreateOrderItemDto[];
	public weight: number;

}