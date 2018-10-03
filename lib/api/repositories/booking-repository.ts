import { Booking } from './../model/entity/booking/index';
import { MobileDevice } from './../model/entity/members/device';
import { PaymentAccount } from './../model/entity/members/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from './../model/dto/index';
import { Repository, createConnection } from "typeorm";
import {  } from "../model/dto";
import { Order } from '../model/entity/order';


export class BookingRepository  {

  public static instance: BookingRepository = new BookingRepository();

  private _bookingRepositoryPromise: Promise<Repository<Booking>>;

  constructor() {
    this._bookingRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => {
        resolve(connection.getRepository(Booking));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async saveBooking(booking: Booking): Promise<void> {

    const repository = await this._bookingRepositoryPromise;
    await repository.save(booking);

  }

  

}