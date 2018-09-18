import { createConnection, Connection } from "typeorm";

export async function connectToDatabase(): Promise<Connection> {
  return createConnection();
}