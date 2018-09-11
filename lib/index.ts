import API from "./api";
import { UserController } from "./api/v1/controllers/user-controller";

const port = process.env.PORT || 3000;
const api = new API();

api.registerController(UserController);

api.run(port);
