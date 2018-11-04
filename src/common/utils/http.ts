import {Exception} from "../errors";


export namespace HTTP {

	export function parseJSONBody<Type extends any>(body: string, classRef: {new(): Type}) {

		let obj = new classRef;
		let requiredFields = Reflect.getMetadata("__REQUIRED_PROPERTIES__", obj) || [];

		try {
			obj = JSON.parse(body);
		} catch (_) {}

		requiredFields.map((requiredField: string) => {
			if (!obj[requiredField]) {
				throw new Exception.MissingFieldException(requiredField);
			}
		});

		return obj;

	}

}