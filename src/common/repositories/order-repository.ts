import { Repository, createConnection } from "typeorm";
import { Order } from '../model/entity/order';
import { BaseRepository } from "./base-repository";


export class OrderRepository extends BaseRepository {

  private _orderRepositoryPromise: Repository<Order> = this.connection.getRepository(Order);

}