import { Member } from "../../model/entity/users/member";
import { Order } from "../../model/entity/order";
import { AssignOrderDriverRequestDto, EditOrderRequestDto, CreateOrderItemRequest } from "../../model/dto";
import { LaundryPartner } from "../../model/entity/users/laundry";


export interface IOrderRepository {
	
	orderExists(id: number): Promise<boolean>;
	saveOrder(order: Order): Promise<Order>;
	getOrderById(id: number): Promise<Order | undefined>;
	getOrdersForMember(member: Member): Promise<Order[]>;
	createOrder(order: Order): Promise<Order>;
	getOrders(pageLength?: number, offset?: number): Promise<Order[]>;
	assignDriverToPickupOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	assignDriverToDeliverOrder(request: AssignOrderDriverRequestDto): Promise<void>;
	editOrder(editOrderRequest: EditOrderRequestDto): Promise<Order>;
	setOrderItemCount(order: Order, itemCount: number): Promise<Order>;
	getTodayOrdersByLaundryPartner(partner: LaundryPartner): Promise<Order[]>;
	
}