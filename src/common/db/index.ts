import { createConnection, getConnectionOptions, ConnectionOptions } from "typeorm";
import DatabaseLogger from "./logger";


export namespace DB {

  export function configureConnectionOptions() {
    getConnectionOptions().then(connectionOptions => {
      return createConnection({
        ...connectionOptions, 
        // logger: new DatabaseLogger,
        url: process.env.DATABASE_URL || "postgres://root@localhost:5432/pressy",
        logger: process.env.NODE_ENV == "production" ? new DatabaseLogger : "file"
      } as ConnectionOptions);
    });
  }

}