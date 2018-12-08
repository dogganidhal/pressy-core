
let {exec} = require("child_process");

let app = process.argv[2];
let nodeEnv = process.env['NODE_ENV'] || "local";

if (!app) {
    console.error("Usage : node scripts/start [APP]");
    process.exit(1);
}

// Staging || Production
let command = `ts-node src/index.${app}.ts`;

// Local
if (nodeEnv === "local")
    command = `nodemon --exec 'ts-node' src/index.${app}.ts --watch src/${app} --watch src/index.${app}.ts`;

console.warn(`Running program : ${command}`);


let executable = exec(command, error => {

    if (error) {
        console.error(error);
        process.exit(1);
    }

});

executable.stdout.on("data", data => console.log(data));

executable.stderr.on("error", error => console.error(error));
executable.stderr.on("data", data => console.error(data));