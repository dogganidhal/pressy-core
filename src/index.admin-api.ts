import {AdminAPI} from "./admin-api";
import { getConfig } from "./config";

const port = process.env.PORT || getConfig().runtime.port["admin-api"];
const api = new AdminAPI();

api.run(port);
