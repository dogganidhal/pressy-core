import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "../order";
import {OrderItem} from "../order/order-item";


@Entity()
export class Invoice {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column({nullable: false})
	public amount: number;

	@JoinColumn()
	@ManyToOne(type => Order, {nullable: false})
	public order: Order;

	@JoinColumn()
	@OneToMany(type => OrderItem, item => item.invoice)
	public items: OrderItem[];

}