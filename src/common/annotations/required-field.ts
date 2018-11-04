import "reflect-metadata";

let __requiredFieldsMetadataKey = "__REQUIRED_PROPERTIES__";

export function Required(target: Object, key: string): void {

	let requiredFields = Reflect.getMetadata(__requiredFieldsMetadataKey, target) || [];
	Reflect.defineMetadata(__requiredFieldsMetadataKey, [...requiredFields, key], target);

}