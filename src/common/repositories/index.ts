import { Connection } from "typeorm";

export abstract class ARepository {

  constructor (protected connection: Connection) {}

}