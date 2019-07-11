import {
	Connection,
	createConnection as createTypeORMConnection,
	getConnection as getTypeORMConnection,
} from "typeorm";


export namespace Database {

	let connectionName: string;

	export async function createConnection(name?: string): Promise<Connection> {

		if (process.env.TEST_ENV)
			connectionName = process.env.TEST_ENV || "local";
		else
			connectionName = process.env.NODE_ENV || "local";

		return createTypeORMConnection(name || connectionName);

	}

	export function getConnection(name?: string): Connection {
		return getTypeORMConnection(name || connectionName);
	}

}