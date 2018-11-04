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
				return await returnValue;
			} else {
				return returnValue;
			}

		} catch (exception) {

			const response = context.getPendingResponse();

			if (response) {
				if (exception instanceof Exception.APIException) {

					response.status(exception.statusCode);
					return APIError.create(exception.name, exception.statusCode, exception.message);

				} else {

					response.status(500);
					// TODO: Log the error, because it shouldn't happen
					console.warn(exception);
					return APIError.INTERNAL_SERVER_ERROR;

				}
			}

		}

	};

	return propertyDescriptor;

}