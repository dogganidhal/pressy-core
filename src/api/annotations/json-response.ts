import {APIError} from "../model/api-error";
import {BaseController} from "../controllers/base-controller";
import {exception} from "../../common/errors";

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

		} catch (error) {

			const response = context.getPendingResponse();

			if (response) {

				if (error instanceof exception.APIException) {

					response.status(error.statusCode);
					return APIError.create(error.name, error.statusCode, error.message);

				} else {

					response.status(500);
					// TODO: Log the error, because it shouldn't happen
					console.warn(error);
					return APIError.INTERNAL_SERVER_ERROR;

				}
			}

		}

	};

	return propertyDescriptor;

}