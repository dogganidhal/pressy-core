import { ContextRequest, ContextResponse, HttpError } from "typescript-rest";
import { Request, Response } from "express";
import { Member } from "../model/entity/users/member";
import { Exception } from "../errors";
import { AuthRepository, AuthPrivilege } from "../repositories/auth-repository";
import {Connection, getConnection} from "typeorm";
import {APIError} from "../../api/model/api-error";

export abstract class Controller {

  public currentMember?: Member;

  @ContextRequest
  public currentRequest?: Request;
  @ContextResponse
  public currentResponse?: Response;

  public throw<TError extends HttpError>(error: TError) {

    this.currentResponse!.setHeader('Content-Type', 'application/json');
    this.currentResponse!.status(error.statusCode)
      .send({
	      statusCode: error.statusCode || 400,
	      message: error.message
      } as APIError);
    
  }

}