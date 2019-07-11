import {APIError} from "../errors/api-error";
import {BaseController} from "../controller/base-controller";
import {exception} from "../errors";
import {IJSONBodyParameterMetadata} from "./json-body";
import {http} from "../utils/http";

export function JSONEndpoint<TController extends BaseController>(target: TController, property: string, propertyDescriptor: PropertyDescriptor) {

	const originalMethod: Function = propertyDescriptor.value;

	propertyDescriptor.value = async function() {

		const context: TController = this as TController;

		try {

			let returnValue = originalMethod.apply(context, processJSONBodyMetadata(target, property, arguments));

			if (returnValue instanceof Promise)
				return await returnValue;
			else
				return returnValue;

		} catch (error) {

			let response = context.getPendingResponse();

			if (response) {

				if (error instanceof exception.APIException) {

					response.status(error.statusCode);
					return APIError.create(error.name, error.statusCode, error.message);

				} else {

					response.status(500);
					// TODO: Log the error, because it shouldn't happen
					console.warn(error);
					return APIError.InternalServerError(error.message);

				}
			}

		}

	};

	return propertyDescriptor;

}

function processJSONBodyMetadata(target: any, property: string, args: IArguments): any[] {

	let jsonBodyParameters: [IJSONBodyParameterMetadata] = Reflect.getMetadata("__JSON_BODY_PARAMETERS__", target) || [];
	let newArgs = [];

	for (let arg of args)
		newArgs.push(arg);

	for (let parameter of jsonBodyParameters) {
		if (parameter.functionName == property)
			newArgs[parameter.parameterIndex] = http.parseJSONBody(args[parameter.parameterIndex], parameter.classRef);
	}
	return newArgs;

}