import {AdminAPI} from "./admin-api";

const port = process.env.PORT || 3000;
const api = new AdminAPI();

api.run(port);
