import { HttpError } from "typescript-rest";


export namespace Exception {

  export class PasswordResetCodeNotFound extends HttpError {
    constructor(code: string) {
      super('PasswordResetCodeNotFound', 404, `Reset code ${code} was not found`);
    }
  }

  export class PasswordResetCodeExpired extends HttpError {
    constructor(code: string) {
      super('PasswordResetCodeExpired', 400, `Reset code ${code} has already expired`);
    }
  }

  export class WrongPassword extends HttpError {
    constructor() {
      super('WrongPassword', 403, `The given password does not match our records`);
    }
  }

  interface TMemberIdentifier {
    email?: string;
    phone?: string
  }

  export class MemberNotFound extends HttpError {
    constructor(email: string) {
      super('MemberNotFound', 404, `No registerd member with email '${email}' was found`);
    }
  }

  export class NeitherEmailNoPhone extends HttpError {
    constructor() {
      super('NeitherEmailNoPhone', 400, `Must Provide email or phone to login`);
    }
  }

  export class UnauthorizedRequest extends HttpError {
    constructor() {
      super('UnauthorizedRequest', 403, `Access denied to requested resource`);
    }
  }

  export class UnauthenticatedRequest extends HttpError {
    constructor() {
      super('UnauthenticatedRequest', 401, `Must provide auth token to access requested resource`);
    }
  }

  export class AccessTokenNotFound extends HttpError {
    constructor() {
      super('AccessTokenNotFound', 401, `Access token not found`);
    }
  }

  export class AccessTokenExpired extends HttpError {
    constructor() {
      super('AccessTokenExpired', 401, `Access token expired`);
    }
  }

  export class InvalidAccessToken extends HttpError {
    constructor() {
      super('InvalidAccessToken', 401, `Access token not attributed`);
    }
  }

  export class RequiredFieldNotFound extends HttpError {
    constructor(field: string) {
      super('RequiredFieldNotFound', 400, `Required field ${field} is missing`);
    }
  }

}