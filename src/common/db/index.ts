import {
	Connection,
	createConnection as createTypeORMConnection,
	getConnection as getTypeORMConnection,
	getConnectionOptions
} from "typeorm";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";


export namespace Database {

	let connectionName: string;

	export async function createConnection(): Promise<Connection> {

		if (process.env.NODE_ENV != "staging" && process.env.NODE_ENV != "production") {
			// Local
			connectionName = "local";
			return createTypeORMConnection("local");
		}

		// Staging/Production ...

		connectionName = "heroku";

		let options: PostgresConnectionOptions = await getConnectionOptions("heroku") as PostgresConnectionOptions;
		let url = process.env.DATABASE_URL;

		if (!url) {
			console.warn("Can't find postgres database URL");
			process.abort();
		}

		options = {
			...options,
			url: url
		};

		// TODO: Deal with production environment
		return createTypeORMConnection(options);

	}

	export function getConnection(): Connection {
		return getTypeORMConnection(connectionName);
	}

}