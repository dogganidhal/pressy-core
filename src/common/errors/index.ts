

export namespace Exception {

	export abstract class APIException {
		constructor(public name: string, public statusCode: number, public message: string) {}
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

  export class NeitherEmailNoPhoneException extends APIException {
    constructor() {
      super('NeitherEmailNoPhoneException', 400, `Must Provide email or phone to login`);
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
      super('AccessTokenNotFoundException', 401, `Access token not found`);
    }
  }

  export class AccessTokenExpiredException extends APIException {
    constructor() {
      super('AccessTokenExpiredException', 401, `Access token expired`);
    }
  }

  export class InvalidAccessTokenException extends APIException {
    constructor(msg?: string) {
      super('InvalidAccessTokenException', 401, `Invalid access token${msg ? " : " + msg : null}`);
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

  export class AccessTokenAndRefreshTokenDoNotMatchException extends APIException {
    constructor() {
      super('AccessTokenAndRefreshTokenDoNotMatchException', 400, `Access token and refresh token do not match`);
    }
  }

  export class ActivationCodeNotFoundException extends APIException {
    constructor(code: string) {
      super('ActivationCodeNotFoundException', 401, `Activation code '${code}' was not found`);
    }
  }

  export class InvalidCreditCardInformationException extends APIException {
    constructor(msg?: string) {
      super('InvalidCreditCardInformationException', 400, `Invalid credit card information${msg ? " : " + msg : null}`);
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

}