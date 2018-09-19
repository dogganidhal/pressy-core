import "reflect-metadata";
import API from "./api";
import { MemberController } from "./api/controllers";
import { AuthController } from "./api/controllers/auth-controller";

const port = process.env.PORT || 3000;
const api = new API();

api.registerController(MemberController);
api.registerController(AuthController);

api.run(port);
