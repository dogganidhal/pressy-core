import { Address } from '../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../slot";
import { Member } from '../users/member/member';
import { Element } from './element';
import * as DTO from "../../dto/";
import {Driver} from "../users/driver/driver";
import {LaundryPartner} from "../users/laundry";

export enum OrderStatus {
  VALIDATED = "validated",
  TRANSIT_PICKUP = "transit pickup",
  TREATMENT = "treatment",
  TRANSIT_DELIVERY = "transit",
  DELIVERED = "delivered",
	UNVALIDATED = "unvalidated"
}

export interface IOrder {
	pickupSlot: Slot;
	deliverySlot: Slot;
	pickupAddress: Address;
	deliveryAddress: Address;
	member: Member;
	driver?: Driver;
	laundryPartner?: LaundryPartner;
	status?: OrderStatus;
	elements?: Element[];
}

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @ManyToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public pickupSlot: Slot;

  @ManyToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public deliverySlot: Slot;

  @OneToOne(type => Address, {nullable: false})
  @JoinColumn()
  public pickupAddress: Address;

  @OneToOne(type => Address, {nullable: false})
  @JoinColumn()
  public deliveryAddress: Address;

  @ManyToOne(type => Member, {nullable: false})
  @JoinColumn()
  public member: Member;

	@ManyToOne(type => Driver, {nullable: true})
	@JoinColumn()
	public driver: Driver;

	@ManyToOne(type => LaundryPartner, {nullable: true})
	@JoinColumn()
	public laundryPartner: LaundryPartner;

  @OneToMany(type => Element, element => element.order, {nullable: false})
  public elements: Element[];

  @Column({nullable: false})
  public status: OrderStatus;

  public static async create(order: IOrder): Promise<Order> {

    let orderEntity = new Order;

	  orderEntity.member = order.member;
	  orderEntity.status = order.status || OrderStatus.UNVALIDATED;

    orderEntity.pickupSlot = order.pickupSlot;
	  orderEntity.deliverySlot = order.deliverySlot;
	  orderEntity.pickupAddress = order.pickupAddress;
	  orderEntity.deliveryAddress = order.deliveryAddress;

	  if (order.elements)
		  orderEntity.elements = order.elements;

    return orderEntity;

  }

}