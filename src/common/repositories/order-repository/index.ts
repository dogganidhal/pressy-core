import { Member } from "../../model/entity/users/member";
import { Order } from "../../model/entity/order";
import { CreateOrderRequestDto, AssignOrderDriverRequestDto, EditOrderRequestDto, CreateOrderElementRequest } from "../../model/dto";
import { OrderElement } from "../../model/entity/order/order-element";


export interface IOrderRepository {

	getOrdersForMember(member: Member): Promise<Order[]>;
	createOrder(member: Member, createOrderRequest: CreateOrderRequestDto): Promise<Order>;
	getOrders(pageLength?: number, offset?: number): Promise<Order[]>;
	assignDriverToPickupOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	assignDriverToDeliverOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	setOrderElements(order: Order, elements: CreateOrderElementRequest[]): Promise<OrderElement[]>;
	editOrder(editOrderRequest: EditOrderRequestDto): Promise<Order>;

}