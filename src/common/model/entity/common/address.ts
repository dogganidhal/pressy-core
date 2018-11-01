import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Location } from "./location";
import { CreateAddressDTO } from "../../dto/address";
import { GeocodingService } from "../../../../common/services/geocoding-service";
import { LocationRepository } from "../../../repositories/location-repository";

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

  @OneToOne(type => Location, {nullable: false})
  @JoinColumn()
  public location: Location;

  public static async create(createAddressDTO: CreateAddressDTO): Promise<Address> {

    // const locationRepository = new LocationRepository;
    // const geocodingService = new GeocodingService;
    const address = new Address;
    // const addressDTO = await geocodingService.getNormalizedAddress(createAddressDTO);

    // address.city = addressDTO.city;
    // address.country = addressDTO.country;
    // address.formattedAddress = addressDTO.formattedAddress;
    // address.streetName = addressDTO.streetName;
    // address.streetNumber = addressDTO.streetNumber;
    // address.zipCode = addressDTO.zipCode;
    //
    // address.location = new Location;
    //
    // address.location.latitude = addressDTO.location!.latitude;
    // address.location.longitude = addressDTO.location!.longitude;
    //
    // await locationRepository.saveNewLocation(address.location);

    return address;

  }

}