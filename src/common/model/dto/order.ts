import {Required} from "../../annotations";
import {ElementType} from "../entity/order/element";
import { PersonInfo, IPersonInfo } from "./person";
import { Address, IAddress, CreateAddressRequest } from "./address";
import { Slot, ISlot } from "./slot";

export interface IOrderElement {
	orderId: number;
	type: ElementType;
	color: string;
	comment?: string;
}

export class OrderElement {

	public orderId: number;
	public type: ElementType;
	public color: string;
	public comment?: string;

	constructor(element: IOrderElement) {
		this.orderId = element.orderId;
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

export class CreateOrderRequest {

	@Required()
	public pickupSlotId: number;

	@Required()
	public deliverySlotId: number;

	@Required()
	public addressId: number;

}

export interface IOrder {
	id: number;
	pickupSlot: ISlot;
	deliverySlot: ISlot;
	address: IAddress;
	elements: Array<IOrderElement>;
	member: IPersonInfo;
}

export class Order {

	public id: number;
	public pickupSlot: Slot;
	public deliverySlot: Slot;
	public address: Address;
	public elements: Array<IOrderElement>;
	public member: IPersonInfo;

	constructor(order: IOrder) {
		this.id = order.id;
		this.pickupSlot = new Slot(order.pickupSlot);
		this.deliverySlot = new Slot(order.pickupSlot);
		this.address = new Address(order.address);
		this.elements = order.elements.map(element => new OrderElement(element));
		this.member = new PersonInfo(order.member);
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