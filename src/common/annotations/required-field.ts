import "reflect-metadata";

let __requiredFieldsMetadataKey = "__REQUIRED_PROPERTIES__";

export function Required(classRef?: {new(): any}) {
	return function (target: Object, key: string): void {

		let requiredFields = Reflect.getMetadata(__requiredFieldsMetadataKey, target) || {};
		requiredFields[key] = classRef;
		Reflect.defineMetadata(__requiredFieldsMetadataKey, requiredFields, target);

	}

}