let {exec} = require("child_process");

let connectionName = process.argv[2];

exec(`ts-node node_modules/.bin/typeorm schema:sync -c ${connectionName}`, error => {

	if (error) {
		console.error(error);
		process.exit(1);
	}

	console.log("Successfully synced");

});