import {Required} from "../../annotations";
import {slot} from "./slot";
import {member} from "./member";
import {address} from "./address";

export module booking {

	export class CreateBookingRequest {

		@Required()
		public pickupSlotId: number;

		@Required()
		public deliverySlotId: number;

		@Required(address.CreateAddressRequest)
		public pickupAddress: address.CreateAddressRequest;

		@Required(address.CreateAddressRequest)
		public deliveryAddress?: address.CreateAddressRequest;

	}

	export interface IBooking {
		id: number;
		pickupSlot: slot.ISlot;
		deliverySlot: slot.ISlot;
		pickupAddress: address.IAddress;
		deliveryAddress: address.IAddress;
		member: member.IMemberInfo;
	}

	export class Booking {

		public id: number;
		public pickupSlot: slot.Slot;
		public deliverySlot: slot.Slot;
		public PickupAddress: address.Address;
		public deliveryAddress: address.Address;
		public member: member.MemberInfo;

		constructor(booking: IBooking) {
			this.id = booking.id;
			this.pickupSlot = new slot.Slot(booking.pickupSlot);
			this.deliverySlot = new slot.Slot(booking.pickupSlot);
			this.PickupAddress = new address.Address(booking.pickupAddress);
			this.deliveryAddress = new address.Address(booking.deliveryAddress);
			this.member = new member.MemberInfo(booking.member);
		}

	}

}