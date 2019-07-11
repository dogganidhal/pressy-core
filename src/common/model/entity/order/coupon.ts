import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Double
} from "typeorm";
import Stripe from "stripe";
import { Hash, timingSafeEqual } from "crypto";
import { DateUtils } from "../../../../common/utils";

export enum CouponType {
  WELCOME = "15",
  FIVE_EURO_COUPON = "5",
  TEN_EURO_COUPON = "10"
}
export enum CouponStatus {
  REDEEMED,
  NOT_REDEEMED,
  INACTIVE
}

export interface ICoupon {}
export enum CouponDuration {
  Forever,
  Once,
  Repeating
}

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  public no: number;
  @Column({ nullable: true })
  public id: string;
  @Column({ nullable: true })
  public object: string;
  @Column({ nullable: true })
  public type: CouponType;
  @Column({ nullable: true })
  public amount_off: number;
  @Column({ nullable: true })
  public created: number;
  @Column({ nullable: true })
  public currency: string;
  @Column({ nullable: true })
  public duration: string;
  @Column({ nullable: true })
  public duration_in_months: number;
  @Column({ nullable: true })
  public live_mode: Boolean;
  @Column({ nullable: true })
  public max_redemptions: number;
  @Column({ nullable: true })
  public metadata: string;
  @Column({ nullable: true })
  public name: string;
  @Column({ nullable: true })
  public percent_off: number;
  @Column({ nullable: true })
  public redeem_by: number;
  @Column({ nullable: true })
  public times_redeemed: number;
  @Column({ nullable: true })
  public valid: Boolean;

  public static create(coupon: Stripe.coupons.ICoupon): Coupon {
    console.log(coupon.id);
    let Savecoupon = new Coupon();

    Savecoupon.amount_off = coupon.amount_off;
    Savecoupon.created = coupon.created;
    Savecoupon.currency = coupon.currency;
    Savecoupon.duration_in_months = coupon.duration_in_months;
    Savecoupon.id = coupon.id;
    Savecoupon.live_mode = coupon.livemode;
    Savecoupon.valid = coupon.valid;
    Savecoupon.max_redemptions = coupon.max_redemptions;
    Savecoupon.duration = coupon.duration.toString();
    // this.metadata = coupon.metadata;
    Savecoupon.name = coupon.name;
    Savecoupon.object = coupon.object;
    Savecoupon.percent_off = coupon.percent_off;
    Savecoupon.redeem_by = coupon.redeem_by;
    Savecoupon.times_redeemed = coupon.times_redeemed;
    console.log(Savecoupon.id);

    return Savecoupon;
  }
}
