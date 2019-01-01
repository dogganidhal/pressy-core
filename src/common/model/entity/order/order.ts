import { Address } from '../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../slot";
import { Member } from '../users/member';
import {LaundryPartner} from "../users/laundry";
import { OrderElement } from './order-element';

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
	elements?: OrderElement[];
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

  @OneToMany(type => OrderElement, element => element.order, {nullable: false})
  public elements: OrderElement[];

  public static async create(order: IOrder): Promise<Order> {

    let orderEntity = new Order;

    orderEntity.type = order.type;
	  orderEntity.member = order.member;

    orderEntity.pickupSlot = order.pickupSlot;
	  orderEntity.deliverySlot = order.deliverySlot;
	  orderEntity.address = order.address;

	  if (order.elements)
		  orderEntity.elements = order.elements;

    return orderEntity;

  }

}