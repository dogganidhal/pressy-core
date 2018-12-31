import { Member } from "../../model/entity/users/member/member";
import { Order } from "../../model/entity/order";
import { CreateOrderRequestDto, AssignOrderDriverRequestDto } from "../../model/dto";


export interface IOrderRepository {

	getOrdersForMember(member: Member): Promise<Order[]>;
	createOrder(member: Member, createOrderRequest: CreateOrderRequestDto): Promise<Order>;
	getOrders(pageLength?: number, offset?: number): Promise<Order[]>;
	assignDriverToOrder(request: AssignOrderDriverRequestDto): Promise<void>;

}