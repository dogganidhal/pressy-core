import {exception} from "../errors";
import {BaseController} from "../controller/base-controller";
import {crypto, SigningCategory} from "../../services/crypto";


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

			context.pendingPerson= await crypto.decodeJWT(token, category);

			return originalMethod.call(context, ...args);
		};

		return propertyDescriptor;
	}

}

