import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router
} from "express";
import { Server } from "typescript-rest";
import * as bodyParser from "body-parser";
import { MethodNotAllowedError } from "typescript-rest/dist/server-errors";
import open = require("open");
import { Database } from "../db";
import { http } from "../utils/http";
import { exception } from "../errors";
import { getConfig } from "../../config";

interface APIConfig {
  serviceName: string;
  contollers: string | string[];
  swaggerResourceFile?: string;
}

export class APIV1 {
  protected readonly _express: Application = express();
  protected _apiRouter: Router = Router();

  constructor(protected config: APIConfig) {
    this._middleware();
    this._config()
      .then(_ => console.info("Finished loading configuration"))
      .catch(error => console.warn(error));
  }

  private async _config() {
    await Database.createConnection();

    this._express.use((_, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
      );
      next();
    });
    this._express.use((req, res, next) => {
      if (req.method.toLowerCase() === "options") {
        res.status(200).send();
        return;
      }
      next();
    });

    Server.loadServices(this._apiRouter, this.config.contollers);
    if (this.config.swaggerResourceFile) {
      let scheme = process.env.NODE_ENV == "local" ? "http" : "https";
      Server.swagger(
        this._express,
        this.config.swaggerResourceFile,
        "/v1/docs",
        undefined,
        [scheme]
      );
    }

    this._express.use("/v1", this._apiRouter);

    this._express.all("*", (request, response) => {
      response.setHeader("Content-Type", "application/json");
      response
        .status(http.HttpStatus.HTTP_STATUS_NOT_FOUND)
        .send(JSON.stringify(new exception.RouteNotFoundException()));
    });

    this._express.use(
      (
        error: any,
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        if (error instanceof MethodNotAllowedError) {
          response.setHeader("Content-Type", "application/json");
          response
            .status(http.HttpStatus.HTTP_STATUS_METHOD_NOT_ALLOWED)
            .send(
              JSON.stringify(
                new exception.MethodNotAllowedException(request.method)
              )
            );
        }
      }
    );
    if (process.env.NODE_ENV === "local" && !process.env.TEST_ENV)
      open(
        `http://localhost:${
          getConfig().runtime.port[this.config.serviceName]
        }/v1/docs`
      );
  }

  private _middleware() {
    this._express.use(bodyParser.text({ type: "application/json" }));
    this._express.use(bodyParser.text());
  }

  public run(port: number | string) {
    this._express.listen(port);
    console.info(`App up and running at: ${port}`);
  }

  public getApp(): Application {
    return this._express;
  }
}
