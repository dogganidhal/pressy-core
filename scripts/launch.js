
let {exec} = require("child_process");

let app = process.argv[2];
let nodeEnv = process.env['NODE_ENV'] || "local";

if (!app) {
    console.error("Usage : node scripts/start [APP]");
    process.exit(1);
}

let command = `ts-node src/index.${app}.ts`;

if (nodeEnv === "local")
    command += " && nodemon";

let executable = exec(command, error => {

    if (error) {
        console.error(error);
        process.exit(1);
    }

});

executable.stdout.on("data", data => {

    console.log(data);

});
