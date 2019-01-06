import {exception} from "../errors";
import {BaseController} from "../controller/base-controller";
import {crypto, SigningCategory} from "../../services/crypto";
import { APIError } from "../errors/api-error";


export function Authenticate<TController extends BaseController>(category: SigningCategory | SigningCategory[]): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

	return function<TController extends BaseController>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {

		let originalMethod: Function = propertyDescriptor.value;
		propertyDescriptor.value = async function(...args: any[]) {

			let context: TController = this as TController;
			const authorization = context.getPendingRequest().headers["authorization"];

			if (!authorization)
				throw new exception.UnauthenticatedRequestException;

			let authCredentials = authorization.split(" ");
			let token = authCredentials.length == 2 ? authCredentials[1] : authCredentials[0];

			if (!token)
				throw new exception.InvalidAccessTokenException;

			try {
				context.pendingUser = await crypto.decodeJWT(token, category);
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

			return originalMethod.call(context, ...args);
		};

		return propertyDescriptor;
	}

}

