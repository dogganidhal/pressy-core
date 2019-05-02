import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Article } from ".";
import {Invoice} from "../payment/invoice";


@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Invoice, invoice => invoice.items)
  @JoinColumn()
  public invoice: Invoice;

  @ManyToOne(type => Article)
  @JoinColumn()
  public article: Article;

  @Column({nullable: true})
  public quantity: number;

  @Column({nullable: true})
  public comment?: string;

}