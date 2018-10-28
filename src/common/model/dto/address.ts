import { JsonObject, JsonProperty } from "json2typescript";
import { Address } from "../entity/common/address";
import { Location } from "../entity/common/location";

@JsonObject
export class AddressLocationDTO {

  @JsonProperty("longitude", Number)
  public longitude: number = Infinity;

  @JsonProperty("latitude", Number)
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

@JsonObject
export class CreateAddressDTO {

  @JsonProperty("placeId", String, true)
  public placeId?: string = undefined;

  @JsonProperty("location", AddressLocationDTO, true)
  public location?: AddressLocationDTO = undefined;

}

@JsonObject
export class AddressDTO {

  @JsonProperty("streetName", String)
  public streetName: string = "";

  @JsonProperty("streetNumber", String)
  public streetNumber: string = "";

  @JsonProperty("city", String)
  public city: string = "";

  @JsonProperty("country", String)
  public country: string = "";

  @JsonProperty("zipcode", String)
  public zipcode: string = "";

  @JsonProperty("formattedAddress", String)
  public formattedAddress: string = "";

  @JsonProperty("location", AddressLocationDTO, true)
  public location?: AddressLocationDTO = undefined;

  public static create(address: Address): AddressDTO {

    const addressDTO = new AddressDTO;

    addressDTO.city = address.city;
    addressDTO.country = address.country;
    addressDTO.formattedAddress = address.formattedAddress;
    addressDTO.streetName = address.streetName;
    addressDTO.streetNumber = address.streetNumber;
    addressDTO.zipcode = address.zipCode;
    
    if (address.location.latitude && address.location.longitude)
      addressDTO.location = AddressLocationDTO.create(address.location);

    return addressDTO;

  }

}