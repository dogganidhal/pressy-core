import { JsonObject, JsonProperty } from "json2typescript";
import { Address } from "../entity/common";

@JsonObject
export class AddressLocationDTO {

  @JsonProperty("longitude", Number)
  public longitude: number = Infinity;

  @JsonProperty("latitude", Number)
  public latitude: number = Infinity;

}

@JsonObject
export class CreateAddressDTO {

  @JsonProperty("place_id", String, true)
  public placeId?: string = undefined;

  @JsonProperty("location", AddressLocationDTO, true)
  public location?: AddressLocationDTO = undefined;

}

@JsonObject
export class AddressDTO {

  @JsonProperty("street_name", String)
  public streetName: string = "";

  @JsonProperty("street_number", String)
  public streetNumber: string = "";

  @JsonProperty("city", String)
  public city: string = "";

  @JsonProperty("country", String)
  public country: string = "";

  @JsonProperty("zipcode", String)
  public zipcode: string = "";

  @JsonProperty("formatted_address", String)
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
    
    if (address.location.latitude && address.location.longitude) {
      const locationDTO = new AddressLocationDTO;
      locationDTO.latitude = address.location.latitude;
      locationDTO.longitude = address.location.longitude;
      addressDTO.location = locationDTO;
    }

    return addressDTO;

  }

}