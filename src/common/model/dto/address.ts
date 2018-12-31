import {Required} from "../../annotations";

export class DeleteAddressRequestDto {

	@Required()
	public addressId: number;

}

export class CreateAddressRequestDto {

	public name?: string;
	public extraLine?: string;
	public googlePlaceId?: string;
	public coordinates?: {
		latitude: number;
		longitude: number;
	}

}

export class UpdateAddressRequestDto {

	@Required()
	public addressId: number;

	@Required(CreateAddressRequestDto)
	public addressDetails: CreateAddressRequestDto;

}

export interface IAddress {
	id?: number;
	streetName: string;
	streetNumber: string;
	city: string;
	country: string;
	zipCode: string;
	formattedAddress: string;
	name?: string;
	extraLine?: string;
}

export class AddressDto {

	public id?: number;
	public streetName: string;
	public streetNumber: string;
	public city: string;
	public country: string;
	public zipCode: string;
	public formattedAddress: string;
	public name?: string;
	public extraLine?: string;

	constructor(address: IAddress) {
		this.id = address.id;
		this.streetName = address.streetName;
		this.streetNumber = address.streetNumber;
		this.city = address.city;
		this.zipCode = address.zipCode;
		this.country = address.country;
		this.formattedAddress = address.formattedAddress;
		this.name = address.name;
		this.extraLine = address.extraLine;
	}

}