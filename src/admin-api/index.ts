import express, { Application } from "express";
import * as bodyParser from "body-parser";
import {Database} from "../common/db";
import {http} from "../common/utils/http";
import {exception} from "../common/errors";
import { Server } from "typescript-rest";
import { DriverController } from "./controllers/driver-controller";
import { AuthController } from "./controllers/auth-controller";


export class AdminAPI {

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
		this.registerController(DriverController);
		this.registerController(AuthController);
		this._express.all("*", (request, response) => {
			response.setHeader("Content-Type", "application/json");
			response.status(http.HttpStatus.HTTP_STATUS_NOT_FOUND).send(JSON.stringify(new exception.RouteNotFoundException));
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