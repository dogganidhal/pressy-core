import Stripe from "stripe";
import { getConfig } from "../config";
import { exception } from "../common/errors";
import { Coupon } from "../common/model/entity/order/coupon";
import {
  VerifyCouponResponseDto,
  IVerifyCouponResponse
} from "../common/model/dto/promo-code";
import { Required } from "common/annotations";

export function getStripeInstance(): Stripe {
  let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "local"]
    .apiKey;
  return new Stripe(stripeApiKey);
}

export function createCopoun(
  duration: "forever" | "once" | "repeating",
  amount_off: number,
  currency: string,
  name: string,
  duration_in_months: number,
  redeem_by: number
) {
  if (!duration) throw "Duration is requred!";

  if (!name) throw "Name is required!";
  let stripe1 = getStripeInstance();
  stripe1.coupons.create({
    duration: duration,
    amount_off: amount_off,
    currency: currency,
    name: name,
    duration_in_months: duration_in_months,
    redeem_by: redeem_by
  });
}

export function listCopouns() {
  let stripe1 = getStripeInstance();
  stripe1.coupons.list({ limit: 3 }, function(err, coupons) {
    // asynchronously called
    console.log(coupons.data);
  });
}

export async function getCoupon(id: string): Promise<string> {
  let stripe = getStripeInstance();
  let isValid: boolean;
  await stripe.coupons
    .retrieve(`${id}`)
    .then(coupon => {
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
    resolve(JSON.stringify({ status: isValid }));
    reject(JSON.stringify({ status: isValid }));
  });
}
