import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {StatusUpdate} from "./";
import {Booking} from "../booking";
import {Person} from "../users/person";


export enum BookingStatusUpdateType {
	CREATED,
	PICKEDUP_FROM_CLIENT,
	ARRIVED_TO_LAUNDRER,
	FINISHED_LAUNDRY,
	VALIDATED,
	ARRIVED_TO_STORE,
	PICKEDUP_FROM_STORE,
	DELIVERED
}

export enum BookingStatusUpdateDoerIdentity {
	MEMBER, DRIVER, LAUNDRER, ADMIN, SUPERUSER
}

@Entity()
export class BookingStatusUpdate extends StatusUpdate {

	@ManyToOne(type => Booking)
	@JoinColumn()
	public booking: Booking;

	@ManyToOne(type => Person)
	@JoinColumn()
	public doer: Person;

	@Column({nullable: false})
	public type: BookingStatusUpdateType;

	@Column({nullable: false})
	public doerIdentity: BookingStatusUpdateDoerIdentity;

}