import "reflect-metadata";
import {DriverAPI} from "./driver-api";

const port = process.env.PORT || 3000;
const api = new DriverAPI();

api.run(port);
