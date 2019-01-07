import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Order, Article } from ".";
import { CreateOrderItemRequest } from "../../dto";


@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order, order => order.elements)
  @JoinColumn()
  public order: Order;

  @ManyToOne(type => Article)
  @JoinColumn()
  public element: Article

  @Column({nullable: true})
  public color: string;

  @Column({nullable: true})
  public comment?: string;

  public static create(order: Order, createOrderItemRequest: CreateOrderItemRequest, element: Article): OrderItem {

    let orderItem = new OrderItem;

    orderItem.order = order;
    orderItem.element = element;
	  orderItem.color = createOrderItemRequest.color;
	  orderItem.comment = createOrderItemRequest.comment;

    return orderItem;

  }
  
}