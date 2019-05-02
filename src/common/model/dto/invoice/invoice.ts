import {Invoice} from "../../entity/payment/invoice";
import {OrderDto, OrderItemDto} from "../order";


export class InvoiceDto {

	public id: number;
	public amount: number;
	public order: OrderDto;
	public items: OrderItemDto[];

	public static create(invoice: Invoice): InvoiceDto {
		let dto = new InvoiceDto;
		dto.amount = invoice.amount;
		dto.items = invoice.items.map(item => new OrderItemDto(item));
		dto.order = new OrderDto(invoice.order);
		return dto;
	}

}