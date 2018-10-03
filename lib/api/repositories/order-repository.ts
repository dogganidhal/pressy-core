import { MobileDevice } from './../model/entity/members/device';
import { PaymentAccount } from './../model/entity/members/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from './../model/dto/index';
import { Repository, createConnection } from "typeorm";
import {  } from "../model/dto";
import { Exception } from "../errors";
import { DateUtils } from "../utils";
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