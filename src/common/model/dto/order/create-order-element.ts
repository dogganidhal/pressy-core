import { Required } from "../../../annotations";


export class CreateOrderItemRequest {

	@Required()
	public elementId: number;

	@Required()
	public color: string;

	public comment?: string;

}