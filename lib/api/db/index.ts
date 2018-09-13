import { createConnection, Connection, ConnectionOptions } from "typeorm";
import database from "../../../database";

export async function connectToDatabase(): Promise<Connection> {
  const databaseOptions: ConnectionOptions = {
    ...database,
    name: new Date().toUTCString()
  }
  if (process.env.NODE_ENV == "development") {
    return createConnection(databaseOptions);
  }
  // TODO: Do something else for production
  return createConnection(database);
}