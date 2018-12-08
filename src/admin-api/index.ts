import express, { Application, Router } from "express";
import * as bodyParser from "body-parser";
import {Database} from "../common/db";
import {http} from "../common/utils/http";
import {exception} from "../common/errors";
import { Server } from "typescript-rest";
import { Request, Response } from "express";
import { MethodNotAllowedError } from "typescript-rest/dist/server-errors";


export class AdminAPI {

	private readonly _express: Application;
	private _apiRouter: Router = Router();

	constructor() {
		this._express = express();
		this._middleware();
		this._config()
			.then(_ => console.info("Finished loading configuration"))
			.catch(error => console.warn(error));
	}

	private async _config() {
		await Database.createConnection();

		Server.loadServices(this._apiRouter, "./src/admin-api/controllers/*");
		Server.swagger(this._express, "./dist/docs/admin-api/swagger.json", "/v1/docs", undefined, ['http']);

		this._express.use('/v1', this._apiRouter);

		this._express.all("*", (request, response) => {
			response.setHeader("Content-Type", "application/json");
			response.status(http.HttpStatus.HTTP_STATUS_NOT_FOUND).send(JSON.stringify(new exception.RouteNotFoundException));
		});

		this._express.use((error: any, request: Request, response: Response, next: any) => {
			if (error instanceof MethodNotAllowedError) {
				response.setHeader("Content-Type", "application/json");
				response.status(http.HttpStatus.HTTP_STATUS_METHOD_NOT_ALLOWED)
					.send(JSON.stringify(new exception.MethodNotAllowedException(request.method)));
			}
			next();
		});

	}

	private _middleware() {
		this._express.use(bodyParser.text({type: 'application/json'}));
		this._express.use(bodyParser.text());
	}

	public run(port: number | string) {
		this._express.listen(port);
	}

	public getApp(): Application {
		return this._express;
	}

}