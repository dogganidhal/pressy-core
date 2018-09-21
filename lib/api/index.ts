import express, { Application } from "express";
import { Server } from "typescript-rest";
import * as bodyParser from "body-parser";
import { 
  MemberController, AuthController, DriverController
} from "../api/controllers";
import { DocumentationController } from "./controllers/doc-controller";

export default class API {

  private readonly _express: Application;

  constructor() {
    this._express = express();
    this._middleware();
    this._config();
  }
  
  private async _config() {
    this.registerController(DocumentationController);
    this.registerController(DriverController);
    this.registerController(MemberController);
    this.registerController(AuthController);
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

}