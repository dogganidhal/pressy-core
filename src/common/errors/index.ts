

export namespace exception {

	export abstract class APIException {
		protected constructor(public name: string, public statusCode: number, public message: string) {}
	}

	export class MissingFieldsException extends APIException {
		constructor(fields: string) {
			super('MissingFieldsException', 400, `Missing required fields ${fields}`);
		}
	}

  export class PasswordResetCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeNotFoundException', 404, `Reset code ${code} was not found`);
    }
  }

  export class PasswordResetCodeExpiredException extends APIException {
    constructor(code: string) {
      super('PasswordResetCodeExpiredException', 400, `Reset code ${code} has already expired`);
    }
  }

  export class WrongPasswordException extends APIException {
    constructor() {
      super('WrongPasswordException', 403, `The given password does not match our records`);
    }
  }

  export class MemberNotFoundException extends APIException {
    constructor(email: string) {
      super('MemberNotFoundException', 404, `No registered member with email '${email}' was found`);
    }
  }

  export class UnauthorizedRequestException extends APIException {
    constructor() {
      super('UnauthorizedRequestException', 403, `Access denied to requested resource`);
    }
  }

  export class UnauthenticatedRequestException extends APIException {
    constructor() {
      super('UnauthenticatedRequestException', 401, `Must provide auth token to access requested resource`);
    }
  }

  export class AccessTokenNotFoundException extends APIException {
    constructor() {
      super('AccessTokenNotFoundException', 403, `Access token not found`);
    }
  }

  export class AccessTokenExpiredException extends APIException {
    constructor() {
      super('AccessTokenExpiredException', 403, `Access token expired`);
    }
  }

  export class InvalidAccessTokenException extends APIException {
    constructor() {
      super('InvalidAccessTokenException', 403, `Invalid access token`);
    }
  }

	export class InvalidRefreshTokenException extends APIException {
		constructor() {
			super('InvalidRefreshTokenException', 403, `Invalid access token`);
		}
	}

  export class RequiredFieldNotFoundException extends APIException {
    constructor() {
      super('RequiredFieldNotFoundException', 400, `One or more required fields are missing`);
    }
  }

  export class EmailAlreadyExistsException extends APIException {
    constructor(email?: string) {
      super('DuplicateUser', 400, `Email ${email ? "'" + email + "' " : ""}already exists`);
    }
  }

  export class PhoneAlreadyExists extends APIException {
    constructor(phone?: string) {
      super('DuplicateUser', 400, `Phone ${phone ? "'" + phone + "' " : ""}already exists`);
    }
  }

  export class ActivationCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('ActivationCodeNotFoundException', 401, `Activation code '${code}' was not found`);
    }
  }

  export class SlotNotFoundException extends APIException {
    constructor(slotId: number) {
      super('SlotNotFoundException', 404, `No slot with id ${slotId} was found`);
    }
  }

  export class InvalidSlotTypeException extends APIException {
    constructor(slotType: number) {
      super('InvalidSlotTypeException', 400, `Invalid slot type '${slotType}'`);
    }
  }

  export class InvalidDateException extends APIException {
    constructor(dateString: string) {
      super('InvalidDateException', 400, `Invalid date string '${dateString}'`);
    }
  }

  export class CannotCreateAddressException extends APIException {
	  constructor() {
		  super('CannotCreateAddressException', 400, `Can't create address, must provide either Google Place id or Coordinates`);
	  }
  }

}