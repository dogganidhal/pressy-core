import { OrderType, Order } from "../../entity/order";
import {
  SlotDto,
  AddressDto,
  DriverInfoDto,
  MemberInfoDto,
  OrderItemDto
} from "..";

export class OrderDto {
  public id: number;
  public type: OrderType;
  public pickupSlot: SlotDto;
  public deliverySlot: SlotDto;
  public address: AddressDto;
  public items: Array<OrderItemDto>;
  public driver: DriverInfoDto;
  public member: MemberInfoDto;
  public used_coupon_id: string;
  public isCouponApplied: boolean;
  constructor(order: Order) {
    this.id = order.id;
    this.type = order.type;
    this.used_coupon_id = order.used_coupon_id;
    this.pickupSlot = new SlotDto(order.pickupSlot);
    this.deliverySlot = new SlotDto(order.deliverySlot);
    this.address = new AddressDto(order.address);
    this.member = new MemberInfoDto({
      ...order.member.person,
      addresses: order.member.addresses,
      paymentAccounts: order.member.paymentAccounts
    });
  }
}
