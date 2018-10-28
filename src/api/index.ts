import express, { Application } from "express";
import { Server } from "typescript-rest";
import * as bodyParser from "body-parser";
import { 
  MemberController, AuthController, DriverController
} from "../api/controllers";
import { DocumentationController } from "./controllers/doc-controller";
import { OrderController } from "./controllers/order-controller";
import { BookingController } from "./controllers/booking-controller";
import { DB } from "../common/db";

export default class API {

  private readonly _express: Application;

  constructor() {
    this._express = express();
    this._middleware();
    this._config();
  }
  
  private async _config() {
    DB.configureConnectionOptions();
    this.registerController(DocumentationController);
    this.registerController(DriverController);
    this.registerController(MemberController);
    this.registerController(AuthController);
    this.registerController(OrderController);
    this.registerController(BookingController);
  }

  private _middleware() {
    this._express.use(bodyParser.text({type: 'application/json'}));
    this._express.use(bodyParser.text());
  }
 
  public registerController(controller: any) {
    Server.buildServices(this._express, controller);
  }

  public async run(port: number | string) {
    this._express.listen(port);
  }

  public getApp(): Application { 
    return this._express;
  }

}