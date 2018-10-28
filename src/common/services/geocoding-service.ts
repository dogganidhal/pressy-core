import { LocationRepository } from './../repositories/location-repository';
import { AddressDTO, CreateAddressDTO } from './../model/dto/address';
import { Address } from './../model/entity/common/address';
import { Location } from '../model/entity/common/location';
import { RestClient } from "typed-rest-client";
import { getConfig } from '../../config';

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

export class GeocodingService {

  public static instance: GeocodingService = new GeocodingService;
  
  private _restClient: RestClient = new RestClient("PRESSY-REST-AGENT");
  private GOOGLE_SERVICES_URL = "https://maps.googleapis.com/maps/api";

  public async getNormalizedAddress(createAddressDTO: CreateAddressDTO): Promise<AddressDTO> {

    if (createAddressDTO.placeId != undefined)
      return this.getAddressWithPlaceId(createAddressDTO.placeId!);
    
    return this.getAddressWithCoordinates(createAddressDTO.location!);

  }

  public async getAddressWithPlaceId(placeId: string): Promise<AddressDTO> {

    const url = `${this.GOOGLE_SERVICES_URL}/place/details/json?placeid=${placeId}&key=${getConfig().googleMapsAPIKey}`;
    const response = await this._restClient.get(url);

    const results: any = (await response.result)!;
    
    if (results.status != "OK")
      throw new Error(`Can't fetch address components for place_id ${placeId}`);
    
    const placeDetails: IPlaceDetails = (results as any).result;

    var components: IGeocodeAddressComponents = {} as IGeocodeAddressComponents;
    placeDetails.address_components.map((component: any) => {
      component.types.map((category: string) => components[category] = component.long_name);
    });

    const address = new AddressDTO;

    address.city = components.locality!;
    address.country = components.political!;
    address.zipcode = components.postal_code!;
    address.streetName = components.route!;
    address.streetNumber = components.street_number!;
    address.formattedAddress = placeDetails.formatted_address;
    address.location = {
      latitude: placeDetails.geometry.location.lat, 
      longitude: placeDetails.geometry.location.lng
    };

    return address;

  }

  public async getAddressWithCoordinates(coordinates: ICoordinates): Promise<AddressDTO> {
    const url = `${this.GOOGLE_SERVICES_URL}/geocode/json?latlng=\
${coordinates.latitude},${coordinates.longitude}&key=${getConfig().googleMapsAPIKey}`;

    const response = await this._restClient.get(url);
    const result: any = (await response.result as any);
    
    if (result == null || response.statusCode >= 400 || result.status != "OK")
      throw new Error(`Can't fetch address components for coordinates ${coordinates}`);
    
    const placeDetails: IPlaceDetails = result.results[0];

    var components: IGeocodeAddressComponents = {} as IGeocodeAddressComponents;
    placeDetails.address_components.map((component: any) => {
      component.types.map((category: string) => components[category] = component.long_name);
    });

    const address = new AddressDTO;

    address.city = components.locality!;
    address.country = components.political!;
    address.zipcode = components.postal_code!;
    address.streetName = components.route!;
    address.streetNumber = components.street_number!;
    address.formattedAddress = placeDetails.formatted_address;
    address.location = {
      latitude: placeDetails.geometry.location.lat, 
      longitude: placeDetails.geometry.location.lng
    };

    return address;

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

    return this.addressFromResponse(addressResponse);
  }

  private async addressFromResponse(addressResponse: IGeocodeAddressResult): Promise<Address> {
    
    const locationRepository = new LocationRepository;
    var completeAddress = new Address;

    completeAddress.city = addressResponse.address_components.locality!;
    completeAddress.country = addressResponse.address_components.political!;
    completeAddress.zipCode = addressResponse.address_components.postal_code!;
    completeAddress.streetName = addressResponse.address_components.route!;
    completeAddress.streetNumber = addressResponse.address_components.street_number!;
    completeAddress.formattedAddress = addressResponse.formatted_address;
    
    var location = new Location;

    location.latitude = parseFloat(addressResponse.geometry.location.lat);
    location.longitude = parseFloat(addressResponse.geometry.location.lng);
    location.placeId = addressResponse.place_id;

    location = await locationRepository.saveNewLocation(location);

    completeAddress.location = location;
    await locationRepository.saveNewAddress(completeAddress);

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
};