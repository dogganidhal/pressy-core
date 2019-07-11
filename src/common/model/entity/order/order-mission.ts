import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Order } from "./order";
import { Driver } from "../users/driver/driver";


export enum OrderMissionType {
  PICKUP = "pickup",
  DELIVERY = "delivery"
}

@Entity()
export class OrderMission {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public type: OrderMissionType;

  @CreateDateColumn()
  public created: Date;

  @ManyToOne(type => Order, {nullable: false})
  @JoinColumn()
  public order: Order;

  @ManyToOne(type => Driver, {nullable: false})
  @JoinColumn()
  public driver: Driver;

  public static create(type: OrderMissionType, order: Order, driver: Driver): OrderMission {

    let orderMission = new OrderMission();

    orderMission.type = type;
    orderMission.order = order;
    orderMission.driver = driver;

    return orderMission;

  }
 
}