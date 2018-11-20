import {Member} from "../model/entity/users/member/member";
import {constants} from "http2";

export namespace exception {

	export abstract class APIException {
		protected constructor(public name: string, public statusCode: number, public message: string) {}
	}

	export class MissingFieldsException extends APIException {
		constructor(fields: string) {
			super('MissingFieldsException', constants.HTTP_STATUS_BAD_REQUEST, `Missing required fields ${fields}`);
		}
	}

  export class PasswordResetCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeNotFoundException', constants.HTTP_STATUS_NOT_FOUND, `Reset code ${code} was not found`);
    }
  }

  export class PasswordResetCodeExpiredException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeExpiredException', constants.HTTP_STATUS_BAD_REQUEST, `Reset code ${code} has already expired`);
    }
  }

  export class WrongPasswordException extends APIException {
    constructor() {
      super('WrongPasswordException', constants.HTTP_STATUS_UNAUTHORIZED, `The given password does not match our records`);
    }
  }

  export class MemberNotFoundException extends APIException {
    constructor(email: string) {
      super('MemberNotFoundException', constants.HTTP_STATUS_NOT_FOUND, `No registered member with email '${email}' was found`);
    }
  }

  export class UnauthorizedRequestException extends APIException {
    constructor() {
      super('UnauthorizedRequestException', constants.HTTP_STATUS_UNAUTHORIZED, `Access denied to requested resource`);
    }
  }

  export class UnauthenticatedRequestException extends APIException {
    constructor() {
      super('UnauthenticatedRequestException', constants.HTTP_STATUS_UNAUTHORIZED, `Must provide auth token to access requested resource`);
    }
  }

  export class AccessTokenNotFoundException extends APIException {
    constructor() {
      super('AccessTokenNotFoundException', constants.HTTP_STATUS_UNAUTHORIZED, `Access token not found`);
    }
  }

  export class AccessTokenExpiredException extends APIException {
    constructor() {
      super('AccessTokenExpiredException', constants.HTTP_STATUS_UNAUTHORIZED, `Access token expired`);
    }
  }

  export class InvalidAccessTokenException extends APIException {
    constructor() {
      super('InvalidAccessTokenException', constants.HTTP_STATUS_UNAUTHORIZED, `Invalid access token`);
    }
  }

	export class InvalidRefreshTokenException extends APIException {
		constructor() {
			super('InvalidRefreshTokenException', constants.HTTP_STATUS_UNAUTHORIZED, `Invalid access token`);
		}
	}

	export class InactiveMemberException extends APIException {
		constructor(member: Member) {
			super('InactiveMemberException', constants.HTTP_STATUS_FORBIDDEN, `Member with email '${member.person.email}' is not active, activate your account before ordering`);
		}
	}

  export class EmailAlreadyExistsException extends APIException {
    constructor(email?: string) {
      super('DuplicateUser', constants.HTTP_STATUS_BAD_REQUEST, `Email ${email ? "'" + email + "' " : ""}already exists`);
    }
  }

  export class PhoneAlreadyExists extends APIException {
    constructor(phone?: string) {
      super('DuplicateUser', constants.HTTP_STATUS_BAD_REQUEST, `Phone ${phone ? "'" + phone + "' " : ""}already exists`);
    }
  }

	export class InvalidEmailException extends APIException {
		constructor(email: string) {
			super('InvalidEmailException', constants.HTTP_STATUS_BAD_REQUEST, `Email '${email}' is not valid`);
		}
	}

	export class InvalidPhoneException extends APIException {
		constructor(phone: string) {
			super('InvalidPhoneException', constants.HTTP_STATUS_BAD_REQUEST, `Phone '${phone}' is not valid`);
		}
	}

	export class InvalidPasswordException extends APIException {
		constructor(message: string) {
			super('InvalidPasswordException', constants.HTTP_STATUS_BAD_REQUEST, `Invalid password: ${message}`);
		}
	}

  export class ActivationCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('ActivationCodeNotFoundException', constants.HTTP_STATUS_UNAUTHORIZED, `Activation code '${code}' was not found`);
    }
  }

  export class SlotNotFoundException extends APIException {
    constructor(slotId: number) {
      super('SlotNotFoundException', constants.HTTP_STATUS_NOT_FOUND, `No slot with id ${slotId} was found`);
    }
  }

  export class InvalidSlotTypeException extends APIException {
    constructor(slotType: number) {
      super('InvalidSlotTypeException', constants.HTTP_STATUS_BAD_REQUEST, `Invalid slot type '${slotType}'`);
    }
  }

	export class DriverSlotNotFoundException extends APIException {
		constructor(slotId: number) {
			super('DriverSlotNotFoundException', constants.HTTP_STATUS_NOT_FOUND, `No driver slot with id ${slotId} was found`);
		}
	}

  export class InvalidDateException extends APIException {
    constructor(dateString: string) {
      super('InvalidDateException', constants.HTTP_STATUS_BAD_REQUEST, `Invalid date string '${dateString}'`);
    }
  }

  export class CannotCreateAddressException extends APIException {
	  constructor() {
		  super('CannotCreateAddressException', constants.HTTP_STATUS_BAD_REQUEST, `Can't create address, must provide either Google Place id or Coordinates`);
	  }
  }

}