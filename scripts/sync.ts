import { exec } from "child_process";
import { createConnection } from "typeorm";

async function main() {

	let connectionName = process.argv[2];

	process.env.TEST_ENV = "local";
	let connection = await createConnection(connectionName);

	try {
		await exec(`ts-node node_modules/.bin/typeorm schema:sync -c ${connectionName}`)
		await connection.query(`
			INSERT INTO "article" ("id", "name", "laundryPrice", "photoUrl", "comment", "stripeSkuId")
			SELECT -1, 'Sac de 5 KG', 3.99, 'https://www.containerstore.com/catalogimages/110918/LaundryBagPolyCottonWhite_x.jpg?width=1200&height=1200&align=center', null, 'sku_F2F6Z31pHm0n70'
			WHERE NOT EXISTS (
				SELECT "id" FROM "article" WHERE "id" = -1
			);

			INSERT INTO "article" ("id", "name", "laundryPrice", "photoUrl", "comment", "stripeSkuId")
			SELECT -2, 'Penalité Absence', 5.00, '', null, 'sku_F2cOzggwTLFk6Q'
			WHERE NOT EXISTS (
				SELECT "id" FROM "article" WHERE "id" = -2
			);
		`);
	} catch (exception) {
		console.error(exception);
	}

}

main();
