import { CreateOrderRequestDto } from "../../model/dto";
import { Order } from "../../model/entity/order";
import { Member } from "../../model/entity/users/member";
import { TerminateOrderRequest } from "../../model/dto/order/terminate-order-request";
import { Invoice } from "../../model/entity/payment/invoice";


export interface IOrderManager {
  order(member: Member, request: CreateOrderRequestDto): Promise<Order>;
  terminateOrder(request: TerminateOrderRequest): Promise<Invoice>;
  applyAbsencePenalty(orderId: number): Promise<void>;
}