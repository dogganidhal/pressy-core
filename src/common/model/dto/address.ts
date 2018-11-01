import { Address } from "../entity/common/address";
import { Location } from "../entity/common/location";

export class AddressLocationDTO {

  public longitude: number = Infinity;
  public latitude: number = Infinity;

  public static create(location: Location): AddressLocationDTO {
    if (!location.latitude || !location.longitude)
     return new AddressLocationDTO;
    const locationDTO = new AddressLocationDTO;
    locationDTO.latitude = location.latitude;
    locationDTO.longitude = location.longitude;
    return locationDTO;
  }

}

export class CreateAddressDTO {

  public placeId?: string = undefined;

  public location?: AddressLocationDTO = undefined;

}

export class AddressDTO {

  public streetName: string = "";
  public streetNumber: string = "";
  public city: string = "";
  public country: string = "";
  public zipCode: string = "";
  public formattedAddress: string = "";
  public location?: AddressLocationDTO = undefined;

  public static create(address: Address): AddressDTO {

    const addressDTO = new AddressDTO;

    addressDTO.city = address.city;
    addressDTO.country = address.country;
    addressDTO.formattedAddress = address.formattedAddress;
    addressDTO.streetName = address.streetName;
    addressDTO.streetNumber = address.streetNumber;
    addressDTO.zipCode = address.zipCode;
    
    if (address.location.latitude && address.location.longitude)
      addressDTO.location = AddressLocationDTO.create(address.location);

    return addressDTO;

  }

}