import {Required} from "../../annotations";
import {slot} from "./slot";
import {member} from "./member";
import {address} from "./address";
import {ElementType} from "../entity/order/element";

export module order {

	export interface IOrderElement {
		bookingId: number;
		type: ElementType;
		color: string;
		comment?: string;
	}

	export class OrderElement {

		public bookingId: number;
		public type: ElementType;
		public color: string;
		public comment?: string;

		constructor(element: order.IOrderElement) {
			this.bookingId = element.bookingId;
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

		@Required(address.CreateAddressRequest)
		public pickupAddress: address.CreateAddressRequest;

		public deliveryAddress?: address.CreateAddressRequest;

		@Required(Array)
		public elements: Array<CreateOrderElementRequest>;

	}

	export interface IOrder {
		id: number;
		pickupSlot: slot.ISlot;
		deliverySlot: slot.ISlot;
		pickupAddress: address.IAddress;
		deliveryAddress: address.IAddress;
		elements: Array<order.IOrderElement>;
		member: member.IMemberInfo;
	}

	export class Order {

		public id: number;
		public pickupSlot: slot.Slot;
		public deliverySlot: slot.Slot;
		public pickupAddress: address.Address;
		public deliveryAddress: address.Address;
		public elements: Array<order.IOrderElement>;
		public member: member.MemberInfo;

		constructor(order: IOrder) {
			this.id = order.id;
			this.pickupSlot = new slot.Slot(order.pickupSlot);
			this.deliverySlot = new slot.Slot(order.pickupSlot);
			this.pickupAddress = new address.Address(order.pickupAddress);
			this.deliveryAddress = new address.Address(order.deliveryAddress);
			this.elements = order.elements.map(element => new OrderElement(element));
			this.member = new member.MemberInfo(order.member);
		}

	}

}