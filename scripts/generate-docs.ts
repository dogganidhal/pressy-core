import {getConfig} from "../src/config";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";

async function _generateDocsForService(service: any) {

  return new Promise<void>(resolve => {
    
    let swaggerConfigPath = `./dist/docs/swagger-config.${service.serviceName}.json`;
    mkdirSync("dist/docs", {recursive: true});
    writeFileSync(swaggerConfigPath, _replaceArguments(swaggerConfigTemplate, service));
    execSync(`swaggerGen -c ${swaggerConfigPath}`);
    resolve();
    
  });

}

function _replaceArguments(templateString: string, args: any): string {

  let templateArgs = templateString.match(argumentRegex);
  let resultString = templateString.slice();

  if (templateArgs != null) {
    for (let templateArg of templateArgs) {

      let argumentKey = templateArg.substring(2, templateArg.length - 2);
      let argumentValue = args[argumentKey];

      resultString = resultString.replace(templateArg, argumentValue);

    }
  }

  return resultString;

}

let hosts = getConfig().runtime.hosts;
let services = [
  {
    serviceName: "mobile-api",
    appName: "Pressy Mobile API",
    host: hosts["mobile-api"][process.env.NODE_ENV || "local"]
  },
  {
    serviceName: "driver-api",
    appName: "Pressy Driver API",
    host: hosts["driver-api"][process.env.NODE_ENV || "local"]
  },
  {
    serviceName: "admin-api",
    appName: "Pressy Admin API",
    host: hosts["admin-api"][process.env.NODE_ENV || "local"]
  }
];

let swaggerConfigTemplate = readFileSync("./resources/swagger-config-template.json").toString();
let argumentRegex = /{{[a-zA-Z]+}}/gi;

Promise.all([
  services.map(async service => await _generateDocsForService(service))
]);