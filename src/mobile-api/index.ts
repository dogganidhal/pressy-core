import express, { Application, Request, Response, NextFunction } from "express";
import { Server } from "typescript-rest";
import * as bodyParser from "body-parser";
import { OrderController } from "./controllers/order-controller";
import { MemberController } from "./controllers/member-controller";
import { AuthController } from "./controllers/auth-controller";
import {Database} from "../common/db";
import {http} from "../common/utils/http";
import {exception} from "../common/errors";
import { MethodNotAllowedError } from "typescript-rest/dist/server-errors";

export class MobileAPI {

	private readonly _express: Application;

	constructor() {
    this._express = express();
    this._middleware();
    this._config()
	    .then(_ => console.info("Finished loading configuration"))
	    .catch(error => console.warn(error));
  }

	private async _config() {
		await Database.createConnection();
    this.registerController(MemberController);
    this.registerController(AuthController);
    this.registerController(OrderController);
		this._express.all("*", (request, response) => {
			response.setHeader("Content-Type", "application/json");
			response.status(http.HttpStatus.HTTP_STATUS_NOT_FOUND).send(JSON.stringify(new exception.RouteNotFoundException));
    });
    this._express.use((error: any, request: Request, response: Response, next: NextFunction) => {
			if (error instanceof MethodNotAllowedError) {
				response.setHeader("Content-Type", "application/json");
				response.status(http.HttpStatus.HTTP_STATUS_METHOD_NOT_ALLOWED)
					.send(JSON.stringify(new exception.MethodNotAllowedException(request.method)));
			}
		});
  }

	private _middleware() {
    this._express.use(bodyParser.text({type: 'application/json'}));
    this._express.use(bodyParser.text());
  }

	public registerController(controller: any) {
    Server.buildServices(this._express, controller);
  }

	public run(port: number | string) {
    this._express.listen(port);
  }

	public getApp(): Application {
    return this._express;
  }

}