let { exec } = require("child_process");
let config = require('../config');
let service = process.env.SERVICE;
let nodeEnv = process.env.NODE_ENV;

let npmCommand = config.services[nodeEnv][service];

if (!npmCommand) {
    console.error("Can't parse npm to start from config.json");
}

let executable = exec(`npm run ${npmCommand}`, error => {
    if (error)
        console.error(error);
});

executable.stdout.on("data", data => console.log(data));

executable.stderr.on("error", error => console.error(error));
executable.stderr.on("data", data => console.error(data));