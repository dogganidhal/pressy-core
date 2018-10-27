import { LocationRepository } from './../../../repositories/location-repository';
import { CreateBookingRequestDTO } from './../../dto/booking';
import { Address } from './../common/address';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, OneToMany, Column } from "typeorm";
import { Slot } from "../order/slot";
import { Member } from '../users/member';
import { SlotRepository } from '../../../repositories/slot-repository';
import { Exception } from '../../../errors';
import { Element } from '../order/order-element';


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
  public status: BookingStatus = BookingStatus.VALIDATED;

  public static async create(member: Member, createBookingRequestDTO: CreateBookingRequestDTO): Promise<Booking> {

    const booking = new Booking;

    booking.pickupAddress = await Address.create(createBookingRequestDTO.pickupAddress);
    
    if (createBookingRequestDTO.deliveryAddress != undefined)
      booking.deliveryAddress = await Address.create(createBookingRequestDTO.deliveryAddress);
    else
      booking.deliveryAddress = booking.pickupAddress;

    await LocationRepository.instance.saveNewAddress(booking.pickupAddress);
    await LocationRepository.instance.saveNewAddress(booking.deliveryAddress);

    const pickupSlot = await SlotRepository.instance.getSlotById(createBookingRequestDTO.pickupSlotId);

    if (!pickupSlot)
      throw new Exception.SlotNotFound(createBookingRequestDTO.pickupSlotId);

    const deliverySlot = await SlotRepository.instance.getSlotById(createBookingRequestDTO.deliverySlotId);

      if (!deliverySlot)
        throw new Exception.SlotNotFound(createBookingRequestDTO.deliverySlotId);

    booking.pickupSlot = pickupSlot;
    booking.deliverySlot = deliverySlot;

    booking.member = member;

    return booking;

  }

}