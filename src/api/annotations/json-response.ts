import {JSONSerialization} from "../../common/utils/json-serialization";
import {HttpError} from "typescript-rest";
import {InternalServerError} from "typescript-rest/dist/server-errors";
import {APIError} from "../model/api-error";
import {BaseController} from "../controllers/base-controller";
import {Exception} from "../../common/errors";

export function JSONResponse<TController extends BaseController>(target: TController, property: string, propertyDescriptor: PropertyDescriptor) {

	const originalMethod: Function = propertyDescriptor.value;

	propertyDescriptor.value = async function(...args: any[]) {

		const context: TController = this as TController;

		try {

			const returnValue = originalMethod.call(context, args);

			if (returnValue instanceof Promise) {
				const response = await returnValue;
				return JSONSerialization.serializeObject(response);
			} else {
				return JSONSerialization.serializeObject(returnValue);
			}

		} catch (exception) {

			if (exception instanceof Exception.APIException) {

				const response = context.getPendingResponse();

				if (response) {
				  response.status(exception.statusCode);
				}

				return APIError.create(exception.statusCode, exception.message);

			} else {

				// TODO: Log the error, because it shouldn't happen
				console.warn(exception);
				return new InternalServerError;

			}

		}

	};

	return propertyDescriptor;

}