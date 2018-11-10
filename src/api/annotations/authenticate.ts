import {Exception} from "../../common/errors";
import {Connection} from "typeorm";
import {BaseController} from "../controllers/base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";


export function Authenticate<TController extends BaseController>(category: crypto.SigningCategory | crypto.SigningCategory[]): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

	return function<TController extends BaseController>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {

		let originalMethod: Function = propertyDescriptor.value;
		propertyDescriptor.value = async function(...args: any[]) {

			let context: TController = this as TController;
			const authorization = context.getPendingRequest().headers["authorization"];

			if (!authorization)
				throw new Exception.UnauthenticatedRequestException;

			const token = authorization!.split(" ")[1];

			if (!token)
				throw new Exception.InvalidAccessTokenException;

			context.pendingPerson= await crypto.decodeJWT(token, category);

			return originalMethod.call(context, ...args);
		};

		return propertyDescriptor;
	}

}

