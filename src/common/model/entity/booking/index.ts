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

  public static async create(member: Member, createBookingRequest: DTO.booking.CreateBookingRequest): Promise<Booking> {

    const booking = new Booking;

    booking.pickupAddress = await Address.create(createBookingRequest.pickupAddress);
	  booking.deliveryAddress = await Address.create(createBookingRequest.deliveryAddress || createBookingRequest.pickupAddress);
    booking.member = member;

    return booking;

  }

}