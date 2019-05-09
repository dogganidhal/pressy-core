import { CreateOrderRequestDto } from "../../model/dto";
import { Order } from "../../model/entity/order";
import { Member } from "../../model/entity/users/member";


export interface IOrderManager {
  order(member: Member, request: CreateOrderRequestDto): Promise<Order>;
}