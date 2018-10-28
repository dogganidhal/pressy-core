import { Repository, createConnection } from "typeorm";
import { Order } from '../model/entity/order';


export class OrderRepository  {

  public static instance: OrderRepository = new OrderRepository();

  private _orderRepositoryPromise: Promise<Repository<Order>>;

  constructor() {
    this._orderRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => {
        resolve(connection.getRepository(Order));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  

}