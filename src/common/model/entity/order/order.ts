import { Booking } from '../booking';
import { Member } from '../users/member';
import {Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, OneToOne, Column} from "typeorm";
import * as DTO from "../../dto";

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @OneToOne(type => Booking)
  @JoinColumn()
  public booking: Booking;

  @Column({nullable: false})
  public price: number;

  public static async create(member: Member, createOrderRequest: DTO.order.CreateOrderRequest): Promise<Order> {

    const order = new Order();


    return order;
    
  }
  
}