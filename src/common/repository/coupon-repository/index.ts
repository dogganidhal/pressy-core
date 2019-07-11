import { Coupon } from "common/model/entity/order/coupon";

export interface ICouponRepository {
  couponExists(id: string): Promise<string>;
  createCoupon(
    duration: string,
    amount_off: number,
    currency: string,
    name: string,
    duration_in_months: number,
    redeem_by: number,
    id: string
  ): Promise<any>;
  getCouponInfo(id: number): Promise<Coupon[]>;
  deleteCoupon(id: number): Promise<Coupon[]>;
}
