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
    constructor(ids: string | TMemberIdentifier) {
      if (typeof ids == 'string') {
        super('MemberNotFound', 404, `No registerd member with email '${ids}' was found`);
      } else {
        super('MemberNotFound', 404, `No registerd member with ${ids.email ? "email" : "phone"} '${ids.email ? ids.email : ids.phone}' was found`);
      }
    }
  }

  export class NeitherEmailNoPhone extends HttpError {
    constructor() {
      super('NeitherEmailNoPhone', 400, `Must Provide email or phone to login`);
    }
  }

}