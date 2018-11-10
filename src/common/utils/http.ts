import {Exception} from "../errors";


export namespace http {

	export function parseJSONBody<Type extends any>(body: string, classRef: {new(): Type}) {

		let obj = new classRef;
		let requiredFields = Reflect.getMetadata("__REQUIRED_PROPERTIES__", obj) || [];

		try {
			obj = JSON.parse(body);
		} catch (_) {}

		let missingFields: string[] = [];

		requiredFields.map((requiredField: string) => {
			if (!obj[requiredField]) {
				missingFields.push(requiredField);
			}
		});

		if (missingFields.length > 0)
			throw new Exception.MissingFieldsException(`[${missingFields.join(",")}]`);

		return obj;

	}

}