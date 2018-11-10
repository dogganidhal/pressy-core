import {Path, POST, ContextRequest} from "typescript-rest";
import { Request } from "express";
import { GeocodeService } from '../../common/services/geocode-service';
import {BaseController} from "./base-controller";
import {JSONResponse} from "../annotations";


@Path('/api/v1/order/')
export class OrderController extends BaseController {

  @JSONResponse
  @POST
  public async createOrder(@ContextRequest request: Request) {

    const geocodingService = new GeocodeService;
    const address = await geocodingService.getAddressWithCoordinates({
      latitude: 48.8144503, longitude: 2.2314194
    });
    
    return address;

  }

}