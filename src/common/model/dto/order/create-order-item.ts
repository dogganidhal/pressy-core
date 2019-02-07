import { Required } from "../../../annotations";


export class CreateOrderItemRequest {

	@Required()
	public itemId: number;

	@Required()
	public color: string;

	public comment?: string;

}