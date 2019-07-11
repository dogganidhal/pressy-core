import { Person, EmailValidationCode, PhoneValidationCode } from "../../model/entity/users/person";
import { ResetPasswordRequestDto, UpdatePersonInfoRequestDto } from "../../model/dto";
import { PasswordResetCode } from "../../model/entity/users/password-reset-code";


export interface IPersonRepository {

  getPersonByEmail(email: string): Promise<Person | undefined>;
  getPersonByPhone(phone: string): Promise<Person | undefined>;
  validateEmail(code: string): Promise<Person>;
  validatePhone(code: string): Promise<Person>;
  resetPassword(code: string, resetPasswordRequest: ResetPasswordRequestDto): Promise<Person>;
  createPasswordResetCode(person: Person): Promise<PasswordResetCode>;
  createEmailValidationCode(person: Person): Promise<EmailValidationCode>;
  createPhoneValidationCode(person: Person): Promise<PhoneValidationCode>;
	updatePersonInfo(person: Person,request: UpdatePersonInfoRequestDto): Promise<void>;
  
}