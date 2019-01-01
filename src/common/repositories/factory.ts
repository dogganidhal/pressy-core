import { IAddressRepository } from "./address-repository";
import {Connection} from "typeorm";
import { Database } from "../db";
import { AddressRepositoryImpl } from "./address-repository/address-repository-impl";
import { IAdminRepository } from "./admin-repository";
import { AdminRepositoryImpl } from "./admin-repository/admin-repository-impl";
import { IDriverRepository } from "./driver-repository";
import { DriverRepositoryImpl } from "./driver-repository/driver-repository-impl";
import { IMemberRepository } from "./member-repository";
import { MemberRepositoryImpl } from "./member-repository/member-repository-impl";
import { IOrderRepository } from "./order-repository";
import { OrderRepositoryImpl } from "./order-repository/order-repository-impl";
import { IPersonRepository } from "./person-repository";
import { PersonRepositoryImpl } from "./person-repository/person-repository-impl";
import { ISlotRepository } from "./slot-repository";
import { SlotRepositoryImpl } from "./slot-repository/slot-repository-impl";
import { IOrderStatusRepository } from "./order-status-repository";
import { OrderStatusRepositoryImpl } from "./order-status-repository/order-status-repository-impl";


export class RepositoryFactory {

  private static _instance: RepositoryFactory;

  public static get instance(): RepositoryFactory {
    if (!this._instance) {
      this._instance = new RepositoryFactory(Database.getConnection());
    }
    return this._instance;
  }

  public constructor(private _connection: Connection) {}

  public createAddressRepository(): IAddressRepository {
    return new AddressRepositoryImpl(this._connection);
  }

  public createAdminRepository(): IAdminRepository {
    return new AdminRepositoryImpl(this._connection);
  }

  public createDriverRepository(): IDriverRepository {
    return new DriverRepositoryImpl(this._connection);
  }

  public createMemberRepository(): IMemberRepository {
    return new MemberRepositoryImpl(this._connection);
  }

  public createOrderRepository(): IOrderRepository {
    return new OrderRepositoryImpl(this._connection);
  }

  public createOrderStatusRepository(): IOrderStatusRepository {
    return new OrderStatusRepositoryImpl(this._connection);
  }

  public createPersonRepository(): IPersonRepository {
    return new PersonRepositoryImpl(this._connection);
  }

  public createSlotRepository(): ISlotRepository {
    return new SlotRepositoryImpl(this._connection);
  }

}