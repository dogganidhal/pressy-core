import { ContextRequest, ContextResponse, HttpError } from "typescript-rest";
import { Request, Response } from "express";

export abstract class Controller {

  @ContextRequest
  protected currentRequest?: Request;
  @ContextResponse
  protected currentResponse?: Response;

  protected throw<TError extends HttpError>(error: TError) {

    this.currentResponse!.setHeader('Content-Type', 'application/json');
    this.currentResponse!.status(error.statusCode)
      .send({
        code: error.statusCode,
        message: error.message
      });

  }

}

export * from "./member-controller";