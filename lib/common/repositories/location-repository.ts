import { Address } from './../model/entity/common/address';
import { MobileDevice } from './../model/entity/members/device';
import { PaymentAccount } from './../model/entity/members/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from './../model/dto/index';
import { Repository, createConnection } from "typeorm";
import bcrypt from "bcrypt";
import {  } from "../model/dto";
import { Exception } from "../errors";
import { DateUtils } from "../utils";
import { Order } from '../model/entity/order';
import { Location } from '../model/entity/common/location';


export class LocationRepository {

  public static instance: LocationRepository = new LocationRepository();

  private _locationRepositoryPromise: Promise<Repository<Location>>;
  private _addressRepositoryPromise: Promise<Repository<Address>>;

  constructor() {
    this._locationRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => {
        resolve(connection.getRepository(Location));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._addressRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => {
        resolve(connection.getRepository(Address));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async saveNewLocation(location: Location): Promise<Location> {
    const repository = await this._locationRepositoryPromise;
    return repository.save(location);
  }

  public async saveNewAddress(address: Address): Promise<Address> {
    const repository = await this._addressRepositoryPromise;
    return repository.save(address);
  }

}