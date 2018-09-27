import { CreateOrderRequestDTO } from './../model/dto/order';
import {
  Path, POST,
  HttpError, Errors, Return, PathParam, ContextRequest 
} from "typescript-rest";
import { MemberRepository, AuthRepository } from "../repositories";
import { Controller, Authenticated } from ".";
import { Exception } from "../errors";
import { HTTPUtils } from "../utils/http-utils";
import { JSONSerialization } from "../utils/json-serialization";
import { Request } from "express";
import { GeocodingService } from '../../common/services/geocoding-service';

@Path('/api/v1/order/')
export class OrderController extends Controller {

  // @Authenticated()
  @POST
  public async createOrder(@ContextRequest request: Request) {

    const address = await GeocodingService.instance.getAddressWithCoordinates({
      latitude: 48.8144503, longitude: 2.2314194
    });
    
    return JSONSerialization.serializeObject(address);

    // try {
      
    //   const orderDTO: CreateOrderRequestDTO = HTTPUtils.parseBody(request.body, CreateOrderRequestDTO);


    // } catch (error) {
    //   this.throw(error);
    // }

  }

}