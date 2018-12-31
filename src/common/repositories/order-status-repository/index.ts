import { Order } from "../../model/entity/order"
import { Driver } from "../../model/entity/users/driver/driver";


export interface IOrderStatusRepository {
  registerOrderCreation(order: Order): Promise<void>;
  assignDriverToOrder(order: Order, driver: Driver): Promise<void>;
}