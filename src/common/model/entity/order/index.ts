import { Address } from '../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../slot";
import { Member } from '../users/member/member';
import { Element } from './element';
import * as DTO from "../../dto/";
import {Driver} from "../users/driver/driver";

export enum BookingStatus {
  VALIDATED = 0,
  TRANSIT_PICKUP = 1,
  TREATMENT = 2,
  TRANSIT_DELIVERY = 3,
  DELIVERED = 4
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

  @OneToMany(type => Element, element => element.order, {nullable: false})
  public elements: Element[];

  @Column({nullable: false})
  public status: BookingStatus;

  public static async create(
    member: Member, pickupSlot: Slot, deliverySlot: Slot,
    pickupAddress: Address, deliveryAddress: Address = pickupAddress,
    elements: Array<DTO.order.CreateOrderElementRequest>
  ): Promise<Order> {

    let bookingEntity = new Order;

	  bookingEntity.member = member;
	  bookingEntity.status = BookingStatus.VALIDATED;

    bookingEntity.pickupSlot = pickupSlot;
	  bookingEntity.deliverySlot = deliverySlot;
	  bookingEntity.pickupAddress = pickupAddress;
	  bookingEntity.deliveryAddress = deliveryAddress;

	  bookingEntity.elements = elements.map(element => Element.create(bookingEntity, element));

    return bookingEntity;

  }

}