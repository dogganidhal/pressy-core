import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Order, Element } from ".";
import { CreateOrderElementRequest } from "../../dto";


@Entity()
export class OrderElement {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order, order => order.elements)
  @JoinColumn()
  public order: Order;

  @ManyToOne(type => Element)
  @JoinColumn()
  public element: Element

  @Column({nullable: true})
  public color: string;

  @Column({nullable: true})
  public comment?: string;

  public static create(order: Order, createOrderElementRequest: CreateOrderElementRequest, element: Element): OrderElement {

    let orderElement = new OrderElement;

    orderElement.order = order;
    orderElement.element = element;
	  orderElement.color = createOrderElementRequest.color;
	  orderElement.comment = createOrderElementRequest.comment;

    return orderElement;

  }
  
}