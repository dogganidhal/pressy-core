import { CreateOrderRequestDTO } from './../../dto/order';
import { Order } from './order';
import { Address } from '../common';
import { Member } from '../members';
import { 
  Entity, PrimaryGeneratedColumn, 
  ManyToOne, JoinColumn, 
  CreateDateColumn,
  OneToOne,
  Column,
  OneToMany
} from "typeorm";

export enum OrderElementType {
  SHIRT = 1,
  TSHIRT = 2,
  PANT = 4,
  SUIT = 8,
  UNDERWEAR = 16,
  SOCKS = 32
}

@Entity()
export class OrderElement {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order)
  @JoinColumn()
  public order: Order;

  @Column()
  public type: OrderElementType

  @Column({nullable: true})
  public color: string;

  @Column({nullable: true})
  public comment: string;
  
}