import { BaseRepository } from "../base-repository";
import { ICouponRepository } from ".";
import { Coupon, ICoupon } from "../../model/entity/order/coupon";
import { getStripeInstance, getCoupon } from "../../../utils/stripe";
import { exception } from "common/errors";
import Stripe from "stripe";
import { Repository } from "typeorm";
import { Invoice } from "common/model/entity/payment/invoice";
export class CouponRepositoryImpl extends BaseRepository
  implements ICouponRepository {
  private _couponRepository: Repository<Coupon> = this.connection.getRepository(
    Coupon
  );

  public async couponExists(id: string): Promise<string> {
    let stripe = getStripeInstance();

    let isValid: boolean | PromiseLike<boolean> | undefined;

    let myCoupon: Stripe.coupons.ICoupon;

    let catagory: string;

    await stripe.coupons
      .retrieve(`${id}`)
      .then(coupon => {
        myCoupon = coupon;
        if (myCoupon.amount_off == null) {
          catagory = "percent";
        } else {
          catagory = "amount";
        }
        // console.log(coupon);

        isValid = true;
      })
      .catch(err => {
        // if (err.message == `No such coupon: ${id}`) {
        //   //console.log("Invalid Coupon");
        //   throw new exception.InvalidCopounCode(id);
        // }
        isValid = false;
      });
    return new Promise((resolve, reject) => {
      // console.log(myCoupon.amount_off);

      resolve(
        JSON.stringify({
          status: isValid,
          coupon: myCoupon,
          catagory: catagory
        })
      );
      reject(JSON.stringify({ status: isValid }));
    });
  }

  public async createCoupon(
    duration: "forever" | "once" | "repeating",
    amount_off: number,
    currency: string,
    name: string,
    duration_in_months: number,
    redeem_by: number,
    id: string
  ) {
    if (!duration) throw "Duration is requred!";

    if (!name) throw "Name is required!";

    let stripe1 = getStripeInstance();
    stripe1.coupons
      .create({
        duration: duration,
        amount_off: amount_off * 0.01,
        currency: currency,
        name: name,
        duration_in_months: duration_in_months,
        redeem_by: redeem_by,
        id: id
      })
      .then(coupon => {
        // console.log(id);
        let myCoupon: Coupon = Coupon.create(coupon);
        console.log(`myCoupon id:${myCoupon.id}`);
        if (coupon) this._couponRepository.save(myCoupon);
      })
      .catch(err => {
        throw new Error(`${err}`);
      });
  }
  getCouponInfo(id: number): Promise<Coupon[]> {
    throw new Error("Method not implemented.");
  }
  updateCoupon(editOrderRequest: any): Promise<Coupon> {
    this._couponRepository.findOne();
    throw new Error("Method not implemented.");
  }
  deleteCoupon(id: number): Promise<Coupon[]> {
    throw new Error("Method not implemented.");
  }
}
