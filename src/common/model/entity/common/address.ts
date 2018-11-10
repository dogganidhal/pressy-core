import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {AddressDTO} from "../../dto/address";

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

  @Column()
  public streetNumber: string;

  @Column()
  public zipCode: string;

  @Column()
  public formattedAddress: string;

  public static async create(dto: AddressDTO): Promise<Address> {

    const address = new Address;

    address.city = dto.city;
	  address.country = dto.country;
	  address.formattedAddress = dto.formattedAddress;
	  address.streetName = dto.city;
	  address.streetNumber = dto.city;
	  address.zipCode = dto.city;

    return address;

  }

}