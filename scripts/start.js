
let {execSync} = require("child_process");
let config = require('../config');
let service = process.env.SERVICE;
let nodeEnv = process.env.NODE_ENV;

let npmCommand = config.services[nodeEnv][service];

if (!npmCommand) {
    console.error("Can't parse npm to start from config.json");
}

execSync(`npm run ${npmCommand}`);