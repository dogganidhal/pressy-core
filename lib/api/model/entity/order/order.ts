import { Booking } from './../booking/index';
import { Member } from './../members';
import { 
  Entity, PrimaryGeneratedColumn, JoinColumn, 
  CreateDateColumn, OneToOne, Column, OneToMany
} from "typeorm";
import { OrderElement } from './order-element';
import { CreateOrderRequestDTO } from '../../dto/order';

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

  @OneToMany(type => OrderElement, element => element.order)
  public elements: OrderElement[];

  public static async create(member: Member, createOrderDTO: CreateOrderRequestDTO): Promise<Order> {

    const order = new Order();


    return order;
    
  }
  
}