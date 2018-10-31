import "reflect-metadata";
import { API } from "./api";
import { parse } from "pg-connection-string";


if (process.env.NODE_ENV === "production") {
  
  if (process.env.DATABASE_URL != undefined) {

    const config = parse(process.env.DATABASE_URL);

    console.log(config);

    process.env.TYPEORM_USERNAME = config.user!;
    process.env.TYPEORM_PASSWORD = config.password!;
    process.env.TYPEORM_DATABASE = config.database!;
    process.env.TYPEORM_PORT = `${config.port!}`;

  } else {
    console.warn("Cannot parse DATABASE_URL from env");
  }
    
}

const port = process.env.PORT || 3000;
const api = new API();

api.run(port);
