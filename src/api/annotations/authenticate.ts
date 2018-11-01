import {AuthPrivilege, AuthRepository} from "../../common/repositories/auth-repository";
import {Exception} from "../../common/errors";
import {Controller} from "../../common/controller";
import {Connection, createConnection, getConnection} from "typeorm";


export function Authenticate<TController extends Controller>(minimumPrivilege: AuthPrivilege = AuthPrivilege.BASIC): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

	return function<TController extends Controller>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {

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
			const authorization = context.currentRequest!.headers["authorization"];

			if (!authorization) {
				context.throw(new Exception.UnauthenticatedRequestException);
				return;
			}

			const token = authorization!.split(" ")[1];

			if (!token) {
				context.throw(new Exception.InvalidAccessTokenException);
				return;
			}

			try {
			  context.currentMember = await authRepository.decodeToken(token, minimumPrivilege);
			} catch (error) {
			  context.throw(error);
			  return;
			}

			return originalMethod.call(context, ...args);
		};

		return propertyDescriptor;
	}

}