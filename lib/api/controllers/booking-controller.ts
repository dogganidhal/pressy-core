import { BookingRepository } from './../repositories/booking-repository';
import { Booking } from './../model/entity/booking/index';
import { CreateOrderRequestDTO } from './../model/dto/order';
import {
  Path, POST,
  HttpError, Errors, Return, PathParam, ContextRequest 
} from "typescript-rest";
import { MemberRepository, AuthRepository } from "../repositories";
import { Controller, Authenticated } from ".";
import { JSONSerialization } from "../utils/json-serialization";
import { Request } from "express";
import { GeocodingService } from '../../common/services/geocoding-service';
import { Member } from '../model/entity';
import { HTTPUtils } from '../utils/http-utils';
import { CreateBookingRequestDTO } from '../model/dto/booking';

@Path('/api/v1/Book/')
export class BookingController extends Controller {

  private _bookingRepository: BookingRepository = BookingRepository.instance;

  @Authenticated()
  @POST
  public async createBooking(@ContextRequest request: Request) {

    try {

      const createBookingRequestDTO = HTTPUtils.parseBody(request.body, CreateBookingRequestDTO);
      const member: Member = this.currentMember!;
      const booking = await Booking.create(member, createBookingRequestDTO);

      this._bookingRepository.saveBooking(booking);

    } catch (error) {
      console.log(error);
      this.throw(error);
    }

  }

}