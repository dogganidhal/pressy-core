import { JsonObject, JsonProperty } from "json2typescript";

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

  @JsonProperty("location", AddressLocationDTO)
  public location?: AddressLocationDTO = undefined;

}