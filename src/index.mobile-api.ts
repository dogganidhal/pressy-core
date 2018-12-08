import { MobileAPI } from "./mobile-api";
import { getConfig } from "./config";

const port = process.env.PORT || getConfig().runtime.port["mobile-api"];
const api = new MobileAPI();

api.run(port);
