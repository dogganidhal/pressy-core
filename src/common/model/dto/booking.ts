import {Required} from "../../annotations";
import {slot} from "./slot";
import {member} from "./member";
import {address} from "./address";
import {ElementType} from "../entity/booking/element";

export module booking {

	export interface IBookingElement {
		bookingId: number;
		type: ElementType;
		color: string;
		comment?: string;
	}

	export class BookingElement {

		public bookingId: number;
		public type: ElementType;
		public color: string;
		public comment?: string;

		constructor(element: booking.IBookingElement) {
			this.bookingId = element.bookingId;
			this.type = element.type;
			this.color = element.color;
			this.comment = element.comment;
		}

	}

	export class CreateBookingElementRequest {

		@Required()
		public type: ElementType;

		@Required()
		public color: string;

		public comment?: string;

	}

	export class CreateBookingRequest {

		@Required()
		public pickupSlotId: number;

		@Required()
		public deliverySlotId: number;

		@Required(address.CreateAddressRequest)
		public pickupAddress: address.CreateAddressRequest;

		public deliveryAddress?: address.CreateAddressRequest;

		@Required(Array)
		public elements: Array<CreateBookingElementRequest>;

	}

	export interface IBooking {
		id: number;
		pickupSlot: slot.ISlot;
		deliverySlot: slot.ISlot;
		pickupAddress: address.IAddress;
		deliveryAddress: address.IAddress;
		elements: Array<booking.IBookingElement>;
		member: member.IMemberInfo;
	}

	export class Booking {

		public id: number;
		public pickupSlot: slot.Slot;
		public deliverySlot: slot.Slot;
		public pickupAddress: address.Address;
		public deliveryAddress: address.Address;
		public elements: Array<booking.IBookingElement>;
		public member: member.MemberInfo;

		constructor(booking: IBooking) {
			this.id = booking.id;
			this.pickupSlot = new slot.Slot(booking.pickupSlot);
			this.deliverySlot = new slot.Slot(booking.pickupSlot);
			this.pickupAddress = new address.Address(booking.pickupAddress);
			this.deliveryAddress = new address.Address(booking.deliveryAddress);
			this.elements = booking.elements.map(element => new BookingElement(element));
			this.member = new member.MemberInfo(booking.member);
		}

	}

}