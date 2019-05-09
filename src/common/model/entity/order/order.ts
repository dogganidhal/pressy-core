import { Address } from '../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../slot";
import { Member } from '../users/member';
import {LaundryPartner} from "../users/laundry";
import { OrderItem } from './order-item';

export enum OrderType {
  PRESSING,
  WEIGHT
}

export interface IOrder {
  type: OrderType;
	pickupSlot: Slot;
	deliverySlot: Slot;
	address: Address;
	member: Member;
	laundryPartner?: LaundryPartner;
}

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @Column({nullable: false, default: OrderType.PRESSING})
  public type: OrderType;

  @ManyToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public pickupSlot: Slot;

  @ManyToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public deliverySlot: Slot;

  @OneToOne(type => Address, {nullable: false})
  @JoinColumn()
  public address: Address;

  @ManyToOne(type => Member, {nullable: false})
  @JoinColumn()
  public member: Member;

	@ManyToOne(type => LaundryPartner, {nullable: true})
	@JoinColumn()
	public laundryPartner: LaundryPartner;

  @Column({nullable: false, default: 0})
  public itemCount: number = 0;

  public static create(order: IOrder): Order {

    let orderEntity = new Order;

    orderEntity.type = order.type;
	  orderEntity.member = order.member;

    orderEntity.pickupSlot = order.pickupSlot;
	  orderEntity.deliverySlot = order.deliverySlot;
	  orderEntity.address = order.address;

    return orderEntity;

  }

}