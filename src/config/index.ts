import { Config } from './index';
import { readFileSync } from 'fs';

interface MailingConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string
  }
}

interface MailingOptions {
  defaultSender: string;
  senders: string[];
}

interface ServiceHost {
  [key: string]: string;
  local: string;
  production: string;
  staging: string;
}

interface RuntimeConfig {
  port: {
    [key: string]: number;
    "mobile-api": number;
    "driver-api": number;
    "admin-api": number;
    "laundry-api": number;
  },
  hosts: {
    "mobile-api": ServiceHost;
    "driver-api": ServiceHost;
    "admin-api": ServiceHost;
    "laundry-api": ServiceHost;
  }
}

export interface Config {

  logEntriesLoggerAPIKey: string;
  googleMapsAPIKey: string;
  authenticationPublicKey: string;
  authenticationPrivateKey: string;
  mailingServiceConfig: MailingConfig;
  mailingServiceOptions: MailingOptions;
  runtime: RuntimeConfig

}

let cachedConfig: Config;

export function getConfig(): Config {

  if (cachedConfig != undefined)
    return cachedConfig;

  const configJSON = readFileSync("config.json", {encoding: "utf8"});
  const config: Config = JSON.parse(configJSON);

  if (config != undefined)
    cachedConfig = config;

  return config;

}