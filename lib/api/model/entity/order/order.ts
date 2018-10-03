import { Slot } from './slot';
import { Address } from './../common';
import { Member } from './../members';
import { 
  Entity, PrimaryGeneratedColumn, 
  ManyToOne, JoinColumn, 
  CreateDateColumn, OneToOne,
  Column, OneToMany
} from "typeorm";
import { OrderElement } from './order-element';
import { CreateOrderRequestDTO } from '../../dto/order';
import { SlotRepository } from '../../../repositories/slot-reponsitory';
import { Exception } from '../../../errors';

export enum OrderType {
  LIGHT = 1,
  EXPRESS = 2
}

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Member)
  @JoinColumn()
  public member: Member;

  @CreateDateColumn()
  public created: Date;

  @OneToOne(type => Address)
  @JoinColumn()
  public pickupAddress: Address;

  @OneToOne(type => Address)
  @JoinColumn()
  public deliveryAddress: Address;

  @Column({default: OrderType.LIGHT})
  public type: OrderType;

  @Column({nullable: false})
  public price: number;

  @OneToMany(type => OrderElement, element => element.order)
  public elements: OrderElement[];

  @OneToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public pickupSlot: Slot;

  @OneToOne(type => Slot, {nullable: false})
  @JoinColumn()
  public deliverySlot: Slot;

  public static async create(member: Member, createOrderDTO: CreateOrderRequestDTO): Promise<Order> {

    const order = new Order();


    return order;
    
  }
  
}