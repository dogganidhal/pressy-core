import { Member } from "../../model/entity/users/member";
import { Order } from "../../model/entity/order";
import { CreateOrderRequestDto, AssignOrderDriverRequestDto, EditOrderRequestDto, CreateOrderItemRequest } from "../../model/dto";
import { OrderItem } from "../../model/entity/order/order-item";


export interface IOrderRepository {

	getOrdersForMember(member: Member): Promise<Order[]>;
	createOrder(member: Member, createOrderRequest: CreateOrderRequestDto): Promise<Order>;
	getOrders(pageLength?: number, offset?: number): Promise<Order[]>;
	assignDriverToPickupOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	assignDriverToDeliverOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	setOrderItems(order: Order, elements: CreateOrderItemRequest[]): Promise<OrderItem[]>;
	editOrder(editOrderRequest: EditOrderRequestDto): Promise<Order>;
	setOrderItemCount(order: Order, elementCount: number): Promise<Order>;
	
}