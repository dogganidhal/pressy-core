import {Exception} from "../errors";


export namespace HTTP {

	function getMissingRequiredFields(obj: any, fieldNamePrefix = "") {

    let requiredFields = Reflect.getMetadata("__REQUIRED_PROPERTIES__", obj) || [];
    let missingFields: string[] = [];

    requiredFields.map((requiredField: string) => {
      if (!obj[requiredField]) {

      	let missingField = fieldNamePrefix.length > 0 ? `${fieldNamePrefix}.${requiredField}` : requiredField;
        missingFields.push(missingField);

      } else if (typeof obj[requiredField] === "object") {

      	// Recursive Checking
        getMissingRequiredFields(obj[requiredField], requiredField).map(fld => missingFields.push(fld));

			}
    });

    return missingFields;

	}

	export function parseJSONBody<Type extends any>(body: string, classRef: {new(): Type}) {

		let obj = new classRef;

		try {
      Object.assign(obj, obj, JSON.parse(body));
		} catch (_) {}

		let missingFields = getMissingRequiredFields(obj);

		if (missingFields.length > 0)
			throw new Exception.MissingFieldsException(`[${missingFields.join(",")}]`);

		return obj;

	}

}