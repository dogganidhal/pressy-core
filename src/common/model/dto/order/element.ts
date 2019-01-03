import { Element } from "../../entity/order";


export class ElementDto {

	public id: number;
	public name: string;
	public laundryPrice: number;
	public comment?: string;

	public constructor(element: Element) {
		this.id = element.id;
		this.name = element.name;
		this.laundryPrice = element.laundryPrice;
		this.comment = element.comment;
	}

}