import {Required} from "../../annotations";
import {ElementType, Element as ElementEntity} from "../entity/order/element";
import { AddressDto } from "./address";
import { SlotDto} from "./slot";
import { Order as OrderEntity } from "../entity/order";


export class OrderElementDto {

	public orderId: number;
	public type: ElementType;
	public color: string;
	public comment?: string;

	constructor(element: ElementEntity) {
		this.orderId = element.order.id;
		this.type = element.type;
		this.color = element.color;
		this.comment = element.comment;
	}

}

export class CreateOrderElementRequest {

	@Required()
	public type: ElementType;

	@Required()
	public color: string;

	public comment?: string;

}

export class CreateOrderRequestDto {

	@Required()
	public pickupSlotId: number;

	@Required()
	public deliverySlotId: number;

	@Required()
	public addressId: number;

}

export class OrderDto {

	public id: number;
	public pickupSlot: SlotDto;
	public deliverySlot: SlotDto;
	public address: AddressDto;
	public elements: Array<OrderElementDto>;

	constructor(order: OrderEntity) {
		this.id = order.id;
		this.pickupSlot = new SlotDto(order.pickupSlot);
		this.deliverySlot = new SlotDto(order.pickupSlot);
		this.address = new AddressDto(order.address);
		this.elements = order.elements.map(element => new OrderElementDto(element));
	}

}

export interface IAssignOrderDriverRequest {
	driverId: number;
	orderId: number;
}

export class AssignOrderDriverRequest {

	@Required()
	public driverId: number;

	@Required()
	public orderId: number;

	public static create(request: IAssignOrderDriverRequest): AssignOrderDriverRequest {
		let createDriverAvailabilityRequest = new AssignOrderDriverRequest;
		
		createDriverAvailabilityRequest.driverId = request.driverId;
		createDriverAvailabilityRequest.orderId = request.orderId;
		
		return createDriverAvailabilityRequest;
	}

}