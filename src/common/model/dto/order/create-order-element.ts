import { Required } from "../../../annotations";


export class CreateOrderElementRequest {

	@Required()
	public elementId: number;

	@Required()
	public color: string;

	public comment?: string;

}