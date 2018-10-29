import { Repository, createConnection } from "typeorm";
import { Order } from '../model/entity/order';
import { ARepository } from ".";


export class OrderRepository extends ARepository {

  private _orderRepositoryPromise: Repository<Order> = this.connection.getRepository(Order);

}