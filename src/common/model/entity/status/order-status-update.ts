import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {StatusUpdate, StatusUpdateDoerIdentity} from "./";
import {Order} from "../order";
import {Person} from "../users/person";
import { exception } from "../../../errors";


export enum OrderStatusUpdateType {
	CREATED = "created",
	ASSIGNED_TO_DRIVER = "assigned_to_driver",
	PICKEDUP_FROM_CLIENT = "picked_up_from_client",
	ARRIVED_TO_LAUNDRER = "arrived_to_laundrer",
	FINISHED_LAUNDRY = "finished_laundry",
	VALIDATED = "validated",
	ARRIVED_TO_STORE = "arrived_to_store",
	PICKEDUP_FROM_STORE = "picked_up_from_store",
	DELIVERED = "delivered", 
	CLIENT_ABSENT = "absent",
	GENERAL = "general"
}

export namespace OrderStatusUpdateType {

	export function fromString(type: string): OrderStatusUpdateType {
		try {
			return <OrderStatusUpdateType>type;
		} catch (error) {
			throw new exception.OrderStatusUpdateNotFound(type);
		}
	}

}

@Entity()
export class OrderStatusUpdate extends StatusUpdate {

	@ManyToOne(type => Order)
	@JoinColumn()
	public order: Order;

	@Column({nullable: false, default: OrderStatusUpdateType.GENERAL})
	public type: OrderStatusUpdateType;

	@Column({nullable: true})
	public payload?: string;

	public static create(
		order: Order, type: OrderStatusUpdateType, doer: Person = order.member.person,
		doerIdentity: StatusUpdateDoerIdentity = StatusUpdateDoerIdentity.MEMBER, payload?: string
	): OrderStatusUpdate {
		let orderStatusUpdate = new OrderStatusUpdate;

		orderStatusUpdate.order = order;
		orderStatusUpdate.doer = doer;
		orderStatusUpdate.type = <OrderStatusUpdateType>type;
		orderStatusUpdate.doerIdentity = doerIdentity;
		orderStatusUpdate.payload = payload;

		return orderStatusUpdate;
	}

}