import API from "./api";
import { UserController } from "./api/controllers";

const port = process.env.PORT || 3000;
const api = new API();

api.registerController(UserController);

api.run(port);
