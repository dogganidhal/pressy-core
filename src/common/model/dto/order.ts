import {Required} from "../../annotations";
import {AddressDto, CreateAddressRequestDto} from "./address";
import {SlotDto, CreateSlotRequestDto} from "./slot";
import {Order, OrderType, Element} from "../entity/order";
import { DriverInfoDto } from "./driver";
import { MemberInfoDto } from "./member";
import { OrderElement } from "../entity/order/order-element";

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

export class OrderElementDto {

	public orderId: number;
	public element: ElementDto;
	public color: string;
	public comment?: string;

	constructor(element: OrderElement) {
		this.orderId = element.order.id;
		this.element = new ElementDto(element.element);
		this.color = element.color;
		this.comment = element.comment;
	}

}

export class CreateOrderElementRequest {

	@Required()
	public elementId: number;

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

	@Required()
	public type: OrderType;

}

export class OrderDto {

	public id: number;
	public type: OrderType;
	public pickupSlot: SlotDto;
	public deliverySlot: SlotDto;
	public address: AddressDto;
	public elements: Array<OrderElementDto>;
	public driver: DriverInfoDto;
	public member: MemberInfoDto;

	constructor(order: Order) {
		
		this.id = order.id;
		this.type = order.type;
		this.pickupSlot = new SlotDto(order.pickupSlot);
		this.deliverySlot = new SlotDto(order.pickupSlot);
		this.address = new AddressDto(order.address);
		this.member = new MemberInfoDto({
			...order.member.person,
			addresses: order.member.addresses
		});

		if (order.elements)
			this.elements = order.elements.map(element => new OrderElementDto(element));	

	}

}

export interface IAssignOrderDriverRequest {
	driverId: number;
	orderId: number;
}

export class AssignOrderDriverRequestDto {

	@Required()
	public driverId: number;

	@Required()
	public orderId: number;

	public static create(request: IAssignOrderDriverRequest): AssignOrderDriverRequestDto {
		let createDriverAvailabilityRequest = new AssignOrderDriverRequestDto;
		
		createDriverAvailabilityRequest.driverId = request.driverId;
		createDriverAvailabilityRequest.orderId = request.orderId;
		
		return createDriverAvailabilityRequest;
	}

}

export class EditOrderRequestDto {

	@Required()
	public id: number;

	public type?: OrderType;
	public pickupSlot?: CreateSlotRequestDto;
	public deliverySlot?: CreateSlotRequestDto;
	public address?: CreateAddressRequestDto;
	public elements?: Array<CreateOrderElementRequest>;
	public memberId?: number;

}