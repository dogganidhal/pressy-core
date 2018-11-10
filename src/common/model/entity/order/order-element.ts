import { Booking } from '../booking';
import { 
  Entity, PrimaryGeneratedColumn, 
  ManyToOne, JoinColumn, Column,
} from "typeorm";

export enum ElementType {
  SHIRT = 1,
  TSHIRT = 2,
  PANT = 4,
  SUIT = 8,
  UNDERWEAR = 16,
  SOCKS = 32
}

@Entity()
export class Element {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Booking)
  @JoinColumn()
  public booking: Booking;

  @Column()
  public type: ElementType;

  @Column({nullable: true})
  public color: string;

  @Column({nullable: true})
  public comment: string;
  
}