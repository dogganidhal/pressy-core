let {exec} = require("child_process");
let databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
	console.error("Can't find database URL");
	process.exit(1);
}

let { readFileSync, writeFileSync } = require("fs");

let buffer = readFileSync("ormconfig.json");
let config = JSON.parse(buffer);
let oldConfig = config;
let connectionName = process.argv[2] || "local";

if (Array.isArray(config)) {

	config.map(c => {
		if (c["name"] === connectionName) {
			c["url"] = databaseURL;
		}
	});

} else {
	config["url"] = databaseURL;
}

writeFileSync("ormconfig.json", JSON.stringify(config));

exec(`ts-node node_modules/.bin/typeorm schema:sync -c ${connectionName}`, error => {

	if (error) {
		console.error(error);
        writeFileSync("ormconfig.json", JSON.stringify(oldConfig, null, 2));
		process.exit(1);
	}

	writeFileSync("ormconfig.json", JSON.stringify(oldConfig, null, 2));

	console.log("Successfully synced");

});