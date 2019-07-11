import { IAddressRepository } from "./address-repository";
import { Connection } from "typeorm";
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
import { IOrderMissionRepository } from "./order-mission-repository";
import { OrderMissionRepositoryImpl } from "./order-mission-repository/order-mission-repository-impl";
import { IArticleRepository } from "./article-repository";
import { ArticleRepositoryImpl } from "./article-repository/article-repository-impl";
import { IPaymentAccountRepository } from "./payment-account-repository";
import { PaymentAccountRepositoryImpl } from "./payment-account-repository/payment-account-repository-impl";
import { ILaundryRepository } from "./laundry-repository";
import { LaundryRepositoryImpl } from "./laundry-repository/laundry-repository-impl";
import { IInvoiceRepository } from "./invoice-repository";
import { InvoiceRepositoryImpl } from "./invoice-repository/invoice-repository-impl";
import { ICouponRepository } from "./coupon-repository";
import { CouponRepositoryImpl } from "./coupon-repository/coupon-repository-impl";

export class RepositoryFactory {
  private static _instance: RepositoryFactory;

  public static get instance(): RepositoryFactory {
    if (!this._instance) {
      this._instance = new RepositoryFactory(Database.getConnection());
    }
    return this._instance;
  }

  public constructor(private _connection: Connection) {}

  public get addressRepository(): IAddressRepository {
    return new AddressRepositoryImpl(this._connection);
  }

  public get adminRepository(): IAdminRepository {
    return new AdminRepositoryImpl(this._connection);
  }

  public get driverRepository(): IDriverRepository {
    return new DriverRepositoryImpl(this._connection);
  }

  public get memberRepository(): IMemberRepository {
    return new MemberRepositoryImpl(this._connection);
  }

  public get laundryRepository(): ILaundryRepository {
    return new LaundryRepositoryImpl(this._connection);
  }

  public get orderRepository(): IOrderRepository {
    return new OrderRepositoryImpl(this._connection);
  }

  public get orderStatusRepository(): IOrderStatusRepository {
    return new OrderStatusRepositoryImpl(this._connection);
  }

  public get personRepository(): IPersonRepository {
    return new PersonRepositoryImpl(this._connection);
  }

  public get slotRepository(): ISlotRepository {
    return new SlotRepositoryImpl(this._connection);
  }

  public get orderMissionRepository(): IOrderMissionRepository {
    return new OrderMissionRepositoryImpl(this._connection);
  }

  public get articleRepository(): IArticleRepository {
    return new ArticleRepositoryImpl(this._connection);
  }

  public get paymentAccountRepository(): IPaymentAccountRepository {
    return new PaymentAccountRepositoryImpl(this._connection);
  }

  public get invoiceRepository(): IInvoiceRepository {
    return new InvoiceRepositoryImpl(this._connection);
  }
  public get CouponRepository(): ICouponRepository {
    return new CouponRepositoryImpl(this._connection);
  }
}
