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

		if (process.env.TEST_ENV)
			connectionName = process.env.TEST_ENV || "local";
		else
			connectionName = process.env.NODE_ENV || "local";

		return createTypeORMConnection(connectionName);

	}

	export function getConnection(): Connection {
		return getTypeORMConnection(connectionName);
	}

}