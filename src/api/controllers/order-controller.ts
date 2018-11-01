import {
  Path, POST, ContextRequest 
} from "typescript-rest";
import { JSONSerialization } from "../../common/utils/json-serialization";
import { Request } from "express";
import { GeocodingService } from '../../common/services/geocoding-service';
import {BaseController} from "./base-controller";

@Path('/api/v1/order/')
export class OrderController extends BaseController {

  @POST
  public async createOrder(@ContextRequest request: Request) {

    const geocodingService = new GeocodingService;
    const address = await geocodingService.getAddressWithCoordinates({
      latitude: 48.8144503, longitude: 2.2314194
    });
    
    return JSONSerialization.serializeObject(address);

  }

}