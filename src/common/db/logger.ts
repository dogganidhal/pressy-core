const Logger = require("le_node");
import { Logger as TypeORMLogger, QueryRunner } from "typeorm";
import { getConfig } from "../../config";


export default class DatabaseLogger implements TypeORMLogger {

  private _logger = new Logger({token: getConfig().logEntriesLoggerAPIKey});

  logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    this._logger.log("debug", {
      query: query,
      parameters: parameters
    });
  }  
  
  logQueryError(error: string, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    this._logger.err({
      query: query,
      parameters: parameters
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    this._logger.warning({
      query: query,
      parameters: parameters
    });
  }
  
  logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
    this._logger.info(`Schema Build : ${message}`);
  }
  
  logMigration(message: string, queryRunner?: QueryRunner | undefined) {
    this._logger.info(`Migration : ${message}`);
  }
  
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner | undefined) {
    this._logger.log(level, message);
  }

}