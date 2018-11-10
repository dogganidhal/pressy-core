import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import * as DTO from "../../dto";

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

  public static async create(dto: DTO.address.CreateAddressRequest): Promise<Address> {

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