import { Connection } from "typeorm";

export abstract class BaseRepository {

  constructor (protected connection: Connection) {}

}