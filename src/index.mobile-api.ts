import { MobileAPI } from "./mobile-api";

const port = process.env.PORT || 3000;
const api = new MobileAPI();

api.run(port);
