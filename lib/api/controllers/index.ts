import { ContextRequest, ContextResponse, HttpError } from "typescript-rest";
import { Request, Response } from "express";
import { AccessPrivilege, Member, AccessToken } from "../model/entity";
import { Exception } from "../errors";
import { MemberRepository, AuthRepository } from "../repositories";
import { Repository } from "typeorm";

export abstract class Controller {

  public currentUser?: Member;

  @ContextRequest
  public currentRequest?: Request;
  @ContextResponse
  public currentResponse?: Response;

  public throw<TError extends HttpError>(error: TError) {

    this.currentResponse!.setHeader('Content-Type', 'application/json');
    this.currentResponse!.status(error.statusCode)
      .send({
        code: error.statusCode,
        message: error.message
      });
  }

}

export function Authenticated<TController extends Controller>(minimumPrivilege: AccessPrivilege = AccessPrivilege.BASIC): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

  return function<TController extends Controller>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {
    var originalMethod: Function = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
      var context: TController = this as TController;

      const authorization = context.currentRequest!.headers["authorization"];

      if (!authorization) {
        context.throw(new Exception.UnauthenticatedRequest());
        return;
      }

      const token = authorization!.split(" ")[1];

      if (!token) {
        context.throw(new Exception.InvalidAccessToken());
        return;
      }

      try {
        context.currentUser = await AuthRepository.instance.decodeToken(token, minimumPrivilege);
      } catch (error) {
        context.throw(error as HttpError);
        return;
      }
      
      return originalMethod.call(context, ...args);
    }
    return propertyDescriptor;
  }

}

export * from "./member-controller";