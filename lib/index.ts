import "reflect-metadata";
import API from "./api";
import { MemberController } from "./api/controllers";

const port = process.env.PORT || 3000;
const api = new API();

api.registerController(MemberController);

api.run(port);
