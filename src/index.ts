import "reflect-metadata";
import { API } from "./api";

const port = process.env.PORT || 3000;
const api = new API();

api.run(port);
