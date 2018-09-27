import "reflect-metadata";
import API from "./api";

// Load the environment variables declared in .env to "process.env"
// Development only, production should have environment variables set on the host dyno.
if (process.env.NODE_ENV === "development") {
  require('dotenv').load({path: "dev.env"});
}

const port = process.env.PORT || 3000;
const api = new API();

api.run(port);
