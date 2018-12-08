import {DriverAPI} from "./driver-api";
import { getConfig } from "./config";

const port = process.env.PORT || getConfig().runtime.port["driver-api"];
const api = new DriverAPI();

api.run(port);
