import {exception} from "../errors";


export namespace http {

	function getMissingRequiredFields(obj: any, classRef: {new(): any}, fieldNamePrefix = "") {

    let requiredFields = Reflect.getMetadata("__REQUIRED_PROPERTIES__", obj) || {};
    let missingFields: string[] = [];

    Object.keys(requiredFields).map((requiredField: string) => {
      if (!obj[requiredField]) {

      	let missingField = fieldNamePrefix.length > 0 ? `${fieldNamePrefix}.${requiredField}` : requiredField;
        missingFields.push(missingField);

      } else if (typeof obj[requiredField] === "object") {
      	// Recursive Checking

	      let nestedClassRef = requiredFields[requiredField];
	      let nestedObject: any;

	      if (nestedClassRef)
	        nestedObject = new nestedClassRef;

	      nestedObject = Object.assign(nestedObject, nestedObject, obj[requiredField]);

        getMissingRequiredFields(nestedObject, requiredFields[requiredField], requiredField).map(fld => missingFields.push(fld));

			}
    });

    return missingFields;

	}

	export function parseJSONBody<Type extends any>(body: string, classRef: {new(): Type}) {

		let obj = new classRef;

		try {
      Object.assign(obj, obj, JSON.parse(body));
		} catch (_) {}

		let missingFields = getMissingRequiredFields(obj, classRef);

		if (missingFields.length > 0)
			throw new exception.MissingFieldsException(`[${missingFields.join(",")}]`);

		return obj;

	}

}