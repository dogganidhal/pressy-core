import { IPaymentManager } from "./payment";
import { PaymentManagerImpl } from "./payment/payment-manager-impl";
import { IMemberManager } from "./member";
import { MemberManagerImpl } from "./member/member-manager-impl";



export class ManagerFactory {

  public static instance: ManagerFactory = new ManagerFactory();

  private constructor() { }

  public get paymentManager(): IPaymentManager {
    return new PaymentManagerImpl();
  }

  public get memberManager(): IMemberManager {
    return new MemberManagerImpl();
  }

}