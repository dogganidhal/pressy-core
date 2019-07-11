import { Required } from "../../../annotations";
import { OrderType } from "../../entity/order";

export class CreateOrderRequestDto {
  @Required()
  public pickupSlotId: number;

  @Required()
  public deliverySlotId: number;

  @Required()
  public addressId: number;

  @Required()
  public type: OrderType;

  @Required()
  public paymentAccountId: string;

  @Required()
  public used_coupon_id: string;

  @Required()
  public isCouponApplied: boolean;
}
