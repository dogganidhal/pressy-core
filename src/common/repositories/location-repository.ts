import { Address } from './../model/entity/common/address';
import { Repository, createConnection } from "typeorm";
import { Location } from '../model/entity/common/location';
import { ARepository } from '.';


export class LocationRepository extends ARepository {

  private _locationRepository: Repository<Location> = this.connection.getRepository(Location);
  private _addressRepository: Repository<Address> = this.connection.getRepository(Address);

  public async saveNewLocation(location: Location): Promise<Location> {
    await this._locationRepository.insert(location);
    return location;
  }

  public async saveNewAddress(address: Address): Promise<Address> {
    await this._addressRepository.insert(address);
    return address;
  }

}