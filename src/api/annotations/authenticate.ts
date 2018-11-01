import {AuthPrivilege, AuthRepository} from "../../common/repositories/auth-repository";
import {Exception} from "../../common/errors";
import {Controller} from "../../common/controller";
import {Connection, createConnection, getConnection} from "typeorm";
import {BaseController} from "../controllers/base-controller";


export function Authenticate<TController extends BaseController>(minimumPrivilege: AuthPrivilege = AuthPrivilege.BASIC): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

	return function<TController extends BaseController>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {

		let originalMethod: Function = propertyDescriptor.value;
		propertyDescriptor.value = async function(...args: any[]) {

			let connection: Connection;

			try {
				connection = getConnection();
			} catch (_) {
				connection = await createConnection();
			}

			let context: TController = this as TController;
			const authRepository = new AuthRepository(connection);
			const authorization = context.getPendingRequest().headers["authorization"];

			if (!authorization)
				throw new Exception.UnauthenticatedRequestException;

			const token = authorization!.split(" ")[1];

			if (!token)
				throw new Exception.InvalidAccessTokenException;

			context.pendingMember = await authRepository.decodeToken(token, minimumPrivilege);

			return originalMethod.call(context, ...args);
		};

		return propertyDescriptor;
	}

}