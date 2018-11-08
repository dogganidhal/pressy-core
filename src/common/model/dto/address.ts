import {Required} from "../../annotations";

export interface IAddressLocation {
	longitude: number;
	latitude: number;
}

export class AddressLocationDTO {

	@Required
	public longitude: number;

	@Required
	public latitude: number;

}

export class CreateAddressDTO {

	@Required
  public placeId: string;

	@Required
  public location: AddressLocationDTO;

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
	  this.streetNumber = address.streetNumber;
	  this.city = address.city;
	  this.zipCode = address.zipCode;
	  this.country = address.country;
	  this.formattedAddress = address.formattedAddress;
	  this.location = address.location && {
	  	latitude: address.location.latitude,
		  longitude: address.location.longitude
	  };
  }

}