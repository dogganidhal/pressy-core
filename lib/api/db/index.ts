import { createConnection, Connection } from "typeorm";
import { Member } from "../entity";
import database from "../../../database";

export async function connectToDatabase(): Promise<Connection> {
  if (process.env.NODE_ENV == "development") {
    return createConnection(database);
  }
  // TODO: Do something else for production
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "",
    database: "pressy",
    entities: [
        Member
    ],
    synchronize: true,
    logging: false
  });
}