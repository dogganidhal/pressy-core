import {APIError} from "../errors/api-error";
import {BaseController} from "../controller/base-controller";
import {exception} from "../errors/index";

export function JSONResponse<TController extends BaseController>(target: TController, property: string, propertyDescriptor: PropertyDescriptor) {

	const originalMethod: Function = propertyDescriptor.value;

	propertyDescriptor.value = async function(...args: any[]) {

		const context: TController = this as TController;

		try {

			const returnValue = originalMethod.call(context, args);

			if (returnValue instanceof Promise) {
				let futureValue = await returnValue;
				return futureValue;
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
					return APIError.InternalServerError(error.message);

				}
			}

		}

	};

	return propertyDescriptor;

}