import {Address} from '../model/entity/common/address';
import {RestClient} from "typed-rest-client";
import {getConfig} from '../../config';
import * as DTO from "../model/dto";
import {exception} from "../errors";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

interface IPlaceDetails {
  address_components: any[];
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: number,
      lng: number
    }
  }
}

export class GeocodeService {

  private _restClient: RestClient = new RestClient("PRESSY-REST-AGENT");
  private GOOGLE_SERVICES_URL = "https://maps.googleapis.com/maps/api";

  public async getAddressWithPlaceId(placeId: string): Promise<DTO.address.Address> {

    const url = `${this.GOOGLE_SERVICES_URL}/place/details/json?placeid=${placeId}&key=${getConfig().googleMapsAPIKey}`;
    const response = await this._restClient.get(url);

    const results: any = (await response.result);
    
    if (results.status != "OK")
      throw new exception.CannotCreateAddressException;
    
    const placeDetails: IPlaceDetails = (results as any).result;

    let components: IGeocodeAddressComponents = {} as IGeocodeAddressComponents;
    placeDetails.address_components.map((component: any) => {
      component.types.map((category: string) => components[category] = component.long_name);
    });

	  return new DTO.address.Address({
		  city: components.locality,
		  country: components.political,
		  zipCode: components.postal_code,
		  streetName: components.route,
		  streetNumber: components.street_number,
		  formattedAddress: placeDetails.formatted_address
	  });

  }

  public async getAddressWithCoordinates(coordinates: ICoordinates): Promise<DTO.address.Address> {
    const url = `${this.GOOGLE_SERVICES_URL}/geocode/json?latlng=\
${coordinates.latitude},${coordinates.longitude}&key=${getConfig().googleMapsAPIKey}`;

    const response = await this._restClient.get(url);
    const result: any = (await response.result as any);
    
    if (result == null || response.statusCode >= 400 || result.status != "OK")
      throw new exception.CannotCreateAddressException;
    
    const placeDetails: IPlaceDetails = result.results[0];

    if (!placeDetails)
      throw new exception.CannotCreateAddressException;

    let components: IGeocodeAddressComponents = {} as IGeocodeAddressComponents;
    placeDetails.address_components.map((component: any) => {
      component.types.map((category: string) => components[category] = component.long_name);
    });

    return new DTO.address.Address({
	    city: components.locality,
	    country: components.political,
	    zipCode: components.postal_code,
	    streetName: components.route,
	    streetNumber: components.street_number,
	    formattedAddress: placeDetails.formatted_address
    });

  }

  public async geocodeAddress(address: string): Promise<Address> {

    const urlEncodedAddress = address.replace(" ", "+");
    const response = await this._restClient.get(`${this.GOOGLE_SERVICES_URL}/geocode/json\
?components=&language=&region=&bounds=&address=${urlEncodedAddress}&key=${getConfig().googleMapsAPIKey}`);

    const json: any = await response.result;
    const addressData = json.results[0];

    if (!addressData)
      throw new Error(`Could not geocode : ${address}`);

    var components: IGeocodeAddressComponents = {} as IGeocodeAddressComponents;
    addressData.address_components.map((component: any) => {
      component.types.map((category: string) => components[category] = component.long_name);
    });

    const addressResponse: IGeocodeAddressResult = addressData;
    addressResponse.address_components = components;

    return GeocodeService.addressFromResponse(addressResponse);
  }

  private static async addressFromResponse(addressResponse: IGeocodeAddressResult): Promise<Address> {
    
    let completeAddress = new Address;

    completeAddress.city = addressResponse.address_components.locality;
    completeAddress.country = addressResponse.address_components.political;
    completeAddress.zipCode = addressResponse.address_components.postal_code;
    completeAddress.streetName = addressResponse.address_components.route;
    completeAddress.streetNumber = addressResponse.address_components.street_number;
    completeAddress.formattedAddress = addressResponse.formatted_address;

    return completeAddress;
  }

}

interface IGeocodeAddressGeometry {
  bounds: {
    northeast: { lat: number, lng: number },
    southwest: { lat: number, lng: number }
  },
  location: { lat: string, lng: string },
  location_type: string,
  viewport: {
    northeast: { lat: number, lng: number },
    southwest: { lat: number, lng: number }
  }
}

interface IGeocodeAddressResult {
  address_components: IGeocodeAddressComponents,
  formatted_address: string,
  geometry: IGeocodeAddressGeometry,
  place_id: string,
  types: [any]
}

interface IGeocodeAddressComponents {
  [key: string]: string;
  street_number: string;
  route: string;
  locality: string,
  political: string,
  administrative_area_level_2: string,
  administrative_area_level_1: string,
  country: string,
  postal_code: string
}