import { promocode } from "mobile-api/controllers/promo-controller";
import {
  CouponType,
  CouponDuration,
  Coupon
} from "common/model/entity/order/coupon";
import { Hash } from "crypto";
import { Double } from "typeorm";
import Stripe from "stripe";
import { DateUtils } from "../../../../common/utils";

// export class CouponDto {
//   public id: string;

//   public object: string;
//   public type: CouponType;
//   public amountOff: number;
//   public created: Date | null;
//   public currency: string;
//   public duration: string;
//   public durationInMonths: number;
//   public liveMode: Boolean;
//   public maxRedemptions: number;
//   public metadata: Stripe.IMetadata;
//   public name: string;
//   public percentOff: number;
//   public redeemBy: Date | null;
//   public timesRedeemed: number;
//   public valid: Boolean;
// }
