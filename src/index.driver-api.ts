import { getConfig } from "./config";
import { APIV1 } from "./common/http/api";

const port = process.env.PORT || getConfig().runtime.port["driver-api"];
const api = new APIV1(require("./driver-api/config"));

api.run(port);
