import {exception} from "../errors";
import {constants} from "http2";

export namespace http {

	export enum HttpStatus {
		HTTP_STATUS_OK = constants.HTTP_STATUS_OK,
		HTTP_STATUS_CREATED = constants.HTTP_STATUS_CREATED,
		HTTP_STATUS_ACCEPTED = constants.HTTP_STATUS_ACCEPTED,
		HTTP_STATUS_BAD_REQUEST = constants.HTTP_STATUS_BAD_REQUEST,
		HTTP_STATUS_UNAUTHORIZED = constants.HTTP_STATUS_UNAUTHORIZED,
		HTTP_STATUS_FORBIDDEN = constants.HTTP_STATUS_FORBIDDEN,
		HTTP_STATUS_NOT_FOUND = constants.HTTP_STATUS_NOT_FOUND,
		HTTP_STATUS_METHOD_NOT_ALLOWED = constants.HTTP_STATUS_METHOD_NOT_ALLOWED
	}

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

	export function parseJSONBody<Type extends any>(body: string, classRef: {new(): Type}): Type {

		let obj = new classRef;

		try {
      Object.assign(obj, obj, JSON.parse(body));
		} catch (_) {}

		let missingFields = getMissingRequiredFields(obj, classRef);

		if (missingFields.length > 0)
			throw new exception.MissingFieldsException(`[${missingFields.join(",")}]`);

		return obj;

	}

	export function parseJSONArrayBody<Type extends any>(body: string, classRef: {new(): Type}): Type[] {

		let objects: Type[] = [];

		for (let object of JSON.parse(body)) {
			let obj = new classRef;

			try {
				Object.assign(obj, obj, object);
			} catch (_) {}

			let missingFields = getMissingRequiredFields(obj, classRef);

			if (missingFields.length > 0)
				throw new exception.MissingFieldsException(`[${missingFields.join(",")}]`);

			objects.push(obj);
		}

		return objects;

	}

}