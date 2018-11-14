import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {StatusUpdate, StatusUpdateDoerIdentity} from "./";
import {Order} from "../order";
import {Person} from "../users/person";


export enum OrderStatusUpdateType {
	CREATED,
	PICKEDUP_FROM_CLIENT,
	ARRIVED_TO_LAUNDRER,
	FINISHED_LAUNDRY,
	VALIDATED,
	ARRIVED_TO_STORE,
	PICKEDUP_FROM_STORE,
	DELIVERED
}

@Entity()
export class OrderStatusUpdate extends StatusUpdate {

	@ManyToOne(type => Order)
	@JoinColumn()
	public order: Order;

	@Column({nullable: false})
	public type: OrderStatusUpdateType;

	public static create(
		order: Order, type: OrderStatusUpdateType, doer: Person = order.member.person,
		doerIdentity: StatusUpdateDoerIdentity = StatusUpdateDoerIdentity.MEMBER
	): OrderStatusUpdate {
		let orderStatusUpdate = new OrderStatusUpdate;

		orderStatusUpdate.order = order;
		orderStatusUpdate.doer = doer;
		orderStatusUpdate.type = type;
		orderStatusUpdate.doerIdentity = doerIdentity;

		return orderStatusUpdate;
	}

}