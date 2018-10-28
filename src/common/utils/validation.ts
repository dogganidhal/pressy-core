export namespace Validation {

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordContainsLetterRegex = /[a-zA-Z]/;
  const passwordContainsDigitRegex = /[0-9]/;

  function matchesRegex(word: string, regex: RegExp): boolean {
    const matches = word.match(regex);
    return matches != null && matches.length != 0;
  }

  export enum InvalidPasswordReason {
    MINUMUM_LENGTH = "Password must be at least 6 characters",
    NUMERIC = "Password must have at least one numeric character",
    LETTERS = "Password must have at least one letter",
  }

  export function validateEmail(email: string): boolean {
    return matchesRegex(email, emailRegex);
  }

  export function validatePassword(password: string): InvalidPasswordReason | null {

    if (password.length < 6)
      return InvalidPasswordReason.MINUMUM_LENGTH;

    if (!matchesRegex(password, passwordContainsLetterRegex))
      return InvalidPasswordReason.LETTERS;

    if (!matchesRegex(password, passwordContainsDigitRegex))
      return InvalidPasswordReason.NUMERIC;

    return null;

  }

}