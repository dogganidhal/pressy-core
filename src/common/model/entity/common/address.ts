import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import * as DTO from "../../dto";
import {Member} from "../users/member/member";

@Entity()
export class Address {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public streetName: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @Column({nullable: true})
  public streetNumber: string;

  @Column()
  public zipCode: string;

  @Column()
  public formattedAddress: string;

  @ManyToOne(type => Member, member => member.addresses, {nullable: true})
  @JoinColumn()
  public member: Member;

  public static create(dto: DTO.address.Address): Address {

    const address = new Address;

    address.city = dto.city;
	  address.country = dto.country;
	  address.formattedAddress = dto.formattedAddress;
	  address.streetName = dto.streetName;
	  address.streetNumber = dto.streetNumber;
	  address.zipCode = dto.zipCode;

    return address;

  }

}