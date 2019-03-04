import {Member} from "../model/entity/users/member";
import {http} from "../utils/http";

export namespace exception {

	export abstract class APIException {
		protected constructor(public name: string, public statusCode: number, public message: string) {}
	}

	export class MissingFieldsException extends APIException {
		constructor(fields: string) {
			super('MissingFieldsException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Missing required fields ${fields}`);
		}
	}

  export class PasswordResetCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Reset code ${code} was not found`);
    }
  }

  export class PasswordResetCodeExpiredException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeExpiredException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Reset code ${code} has already expired`);
    }
  }

  export class WrongPasswordException extends APIException {
    constructor() {
      super('WrongPasswordException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `The given password does not match our records`);
    }
  }

  export class AccountNotFoundException extends APIException {
    constructor(email: string) {
      super('AccountNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No registered account with email '${email}' was found`);
    }
	}
	
	export class MemberNotFoundException extends APIException {
    constructor(id: number) {
      super('MemberNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No member account with id '${id}' was found`);
    }
  }

  export class UnauthenticatedRequestException extends APIException {
    constructor() {
      super('UnauthenticatedRequestException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Must provide auth token to access requested resource`);
    }
  }

  export class AccessTokenNotFoundException extends APIException {
    constructor() {
      super('AccessTokenNotFoundException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Access token not found`);
    }
	}
	
	export class ArticleNotFound extends APIException {
    constructor(id: number) {
      super('ArticleNotFound', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No article with id ${id} was found`);
    }
  }

  export class AccessTokenExpiredException extends APIException {
    constructor() {
      super('AccessTokenExpiredException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Access token expired`);
    }
  }

  export class InvalidAccessTokenException extends APIException {
    constructor() {
      super('InvalidAccessTokenException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Invalid access token`);
    }
  }

	export class InvalidRefreshTokenException extends APIException {
		constructor() {
			super('InvalidRefreshTokenException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Invalid access token`);
		}
	}

	export class InactiveMemberException extends APIException {
		constructor(member: Member) {
			super('InactiveMemberException', http.HttpStatus.HTTP_STATUS_FORBIDDEN, `Member with email '${member.person.email}' is not active, activate your account before ordering`);
		}
	}

  export class EmailAlreadyExistsException extends APIException {
    constructor(email?: string) {
      super('DuplicateUser', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Email ${email ? "'" + email + "' " : ""}already exists`);
    }
  }

  export class PhoneAlreadyExists extends APIException {
    constructor(phone?: string) {
      super('DuplicateUser', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Phone ${phone ? "'" + phone + "' " : ""}already exists`);
    }
  }

	export class InvalidEmailException extends APIException {
		constructor(email: string) {
			super('InvalidEmailException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Email '${email}' is not valid`);
		}
	}

	export class InvalidPhoneException extends APIException {
		constructor(phone: string) {
			super('InvalidPhoneException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Phone '${phone}' is not valid`);
		}
	}

	export class InvalidPasswordException extends APIException {
		constructor(message: string) {
			super('InvalidPasswordException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Invalid password: ${message}`);
		}
	}

  export class EmailValidationCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('EmailValidationCodeNotFoundException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Email validation code '${code}' was not found`);
    }
  }

	export class PhoneValidationCodeNotFoundException extends APIException {
		constructor(code: string) {
			super('PhoneValidationCodeNotFoundException', http.HttpStatus.HTTP_STATUS_UNAUTHORIZED, `Phone validation code '${code}' was not found`);
		}
	}

	export class RouteNotFoundException extends APIException {
		constructor() {
			super('RouteNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Route not found`);
		}
  }
  
  export class MethodNotAllowedException extends APIException {
		constructor(method: string) {
			super('MethodNotAllowedException', http.HttpStatus.HTTP_STATUS_METHOD_NOT_ALLOWED, `Method '${method}' not allowed`);
		}
	}

  export class SlotNotFoundException extends APIException {
    constructor(slotId: number) {
      super('SlotNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No slot with id ${slotId} was found`);
    }
	}
	
	export class OrderStatusUpdateNotFound extends APIException {
    constructor(type: string) {
      super('OrderStatusUpdateNotFound', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Order update type '${type}' is not supported`);
    }
  }

	export class DriverSlotNotFoundException extends APIException {
		constructor(slotId: number) {
			super('DriverSlotNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No driver slot with id ${slotId} was found`);
		}
  }
  
  export class DriverNotFoundException extends APIException {
		constructor(driverId: number) {
			super('DriverNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No driver with id ${driverId} was found`);
		}
  }

  export class CannotCreateAddressException extends APIException {
	  constructor() {
		  super('CannotCreateAddressException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Can't create address, must provide either Google Place id or Coordinates`);
	  }
  }
  
  export class AddressNotFoundException extends APIException {
	  constructor(id: number) {
		  super('AddressNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Can't find address with id '${id}'`);
	  }
	}

	export class PaymentAccountNotFoundException extends APIException {
	  constructor(id: string) {
		  super('PaymentAccountNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `Can't find payment account with id '${id}'`);
	  }
	}

 export class CannotDeleteAddressException extends APIException {
	constructor(id: number) {
	 super('CannotDeleteAddressException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Address with id '${id}' can't be deleted`);
	}
 }

	export class CannotUpdateAddressException extends APIException {
		constructor(id: number) {
			super('CannotUpdateAddressException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Address with id '${id}' can't be updated`);
		}
	}

	export class EmptyOrderException extends APIException {
		constructor() {
			super('EmptyOrderException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `No items in this order, please select some`);
		}
  }
  
  export class OrderNotFoundException extends APIException {
		constructor(orderId: number) {
			super('OrderNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No order with id ${orderId} was found`);
		}
  }

	export class MobileDeviceNotFoundException extends APIException {
	 constructor(deviceId: string) {
		super('MobileDeviceNotFoundException', http.HttpStatus.HTTP_STATUS_NOT_FOUND, `No device with id ${deviceId} was found`);
	 }
	}

	export class CannotDeleteMobileDeviceException extends APIException {
	 constructor(deviceId: string) {
		super('CannotDeleteMobileDeviceException', http.HttpStatus.HTTP_STATUS_BAD_REQUEST, `Device with id ${deviceId} cannot be deleted`);
	 }
	}

}