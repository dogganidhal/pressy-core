import express, { Application } from "express";
import { Server } from "typescript-rest";
import * as bodyParser from "body-parser";

export default class API {

  private readonly _express: Application;

  constructor() {
    this._express = express();
    this._config();
    this._middleware();
  }
  
  private async _config() {
    this._express.use(bodyParser.text())
  }

  private _middleware() {
    
  }
 
  public registerController(controller: any) {
    Server.buildServices(this._express, controller);
  }

  public async run(port: number | string) {
    this._express.listen(port);
  }

}