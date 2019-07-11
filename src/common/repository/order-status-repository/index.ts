import { Order } from "../../model/entity/order"
import { Driver } from "../../model/entity/users/driver/driver";
import { UpdateOrderRequestDto } from "../../model/dto/order/update-order";
import { User } from "../../model/entity/users";


export interface IOrderStatusRepository {

  registerOrderCreation(order: Order): Promise<void>;
  assignDriverToOrder(order: Order, driver: Driver): Promise<void>;
  updateOrderStatus(doer: User, request: UpdateOrderRequestDto): Promise<void>;

}