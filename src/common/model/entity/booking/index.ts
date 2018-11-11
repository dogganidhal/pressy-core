import { Address } from '../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../order/slot";
import { Member } from '../users/member';
import { Element } from '../order/order-element';
import * as DTO from "../../dto/";

export enum BookingStatus {
  VALIDATED = 0,
  TRANSIT_PICKUP = 1,
  TREATMENT = 2,
  TRANSIT_DELIVERY = 3,
  DELIVERED = 4
}


@Entity()
export class Booking {

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

  @OneToOne(type => Address, {nullable: true})
  @JoinColumn()
  public deliveryAddress?: Address;

  @ManyToOne(type => Member, {nullable: false})
  @JoinColumn()
  public member: Member;

  @OneToMany(type => Element, element => element.booking, {nullable: false})
  public elements: Element[];

  @Column({nullable: false})
  public status: BookingStatus;

  public static async create(
    member: Member, pickupSlot: Slot, deliverySlot: Slot,
    pickupAddress: DTO.address.Address, deliveryAddress: DTO.address.Address = pickupAddress


  ): Promise<Booking> {

    let bookingEntity = new Booking;

	  bookingEntity.member = member;
	  bookingEntity.status = BookingStatus.VALIDATED;

    bookingEntity.pickupSlot = pickupSlot;
	  bookingEntity.deliverySlot = deliverySlot;
	  bookingEntity.pickupAddress = Address.create(pickupAddress);
	  bookingEntity.deliveryAddress = Address.create(deliveryAddress);

	  bookingEntity.elements;

    return bookingEntity;

  }

}