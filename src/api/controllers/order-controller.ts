import {
  Path, POST, ContextRequest 
} from "typescript-rest";
import { Controller, Authenticated } from "../../common/controller";
import { JSONSerialization } from "../../common/utils/json-serialization";
import { Request } from "express";
import { GeocodingService } from '../../common/services/geocoding-service';

@Path('/api/v1/order/')
export class OrderController extends Controller {

  // @Authenticated()
  @POST
  public async createOrder(@ContextRequest request: Request) {

    const geocodingService = new GeocodingService;
    const address = await geocodingService.getAddressWithCoordinates({
      latitude: 48.8144503, longitude: 2.2314194
    });
    
    return JSONSerialization.serializeObject(address);

  }

}