import "reflect-metadata";
import API from "./api";
import { parse } from "pg-connection-string";

// Load the environment variables declared in .env to "process.env"
// Development only, production should have environment variables set on the host dyno.
if (process.env.NODE_ENV === "development") {
  
  require('dotenv').load({path: ".env"});
  
} else {

  if (process.env.DATABASE_URL != undefined) {

    const config = parse(process.env.DATABASE_URL);

    process.env.TYPEORM_USERNAME = config.user!;
    process.env.TYPEORM_PASSWORD = config.password!;
    process.env.TYPEORM_DATABASE = config.database!;
    process.env.TYPEORM_PORT = `${config.port!}`;

    console.log(process.env);

  }
  
}

const port = process.env.PORT || 3000;
const api = new API();

api.run(port);
