
export interface IAddressLocation {
	longitude: number;
	latitude: number;
}

export class AddressLocationDTO {

	public longitude: number;
	public latitude: number;

  constructor(location: IAddressLocation) {
    this.latitude = location.latitude;
	  this.longitude = location.longitude;
  }
}

export interface ICreateAddress {
  placeId: string,
  location: IAddressLocation
}

export class CreateAddressDTO {

  public placeId: string;
  public location: AddressLocationDTO;

  constructor(address: ICreateAddress) {
    this.placeId = address.placeId;
    this.location = new AddressLocationDTO(address.location);
  }

}

export interface IAddress {
	streetName: string;
	streetNumber: string;
	city: string;
	country: string;
	zipCode: string;
	formattedAddress: string;
	location?: IAddressLocation;
}

export class AddressDTO {

  public streetName: string;
  public streetNumber: string;
  public city: string;
  public country: string;
  public zipCode: string;
  public formattedAddress: string;
  public location?: IAddressLocation;

  constructor(address: IAddress) {
    this.streetName = address.streetName;
	  this.streetNumber = address.streetName;
	  this.city = address.streetName;
	  this.zipCode = address.streetName;
	  this.country = address.streetName;
	  this.formattedAddress = address.streetName;
	  this.location = address.location && new AddressLocationDTO(address.location);
  }

}