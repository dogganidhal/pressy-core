import {BaseRepository} from '../base-repository';
import {PasswordResetCode} from '../../model/entity/users/password-reset-code';
import {Repository} from "typeorm";
import bcrypt from "bcrypt";
import {exception} from "../../errors";
import {DateUtils} from "../../utils";
import {
  EmailValidationCode,
  Person,
  PersonActivationStatus,
  PhoneValidationCode
} from '../../model/entity/users/person';
import {Member} from "../../model/entity/users/member/member";
import {Driver} from "../../model/entity/users/driver/driver";
import {User} from "../../model/entity/users";
import { ResetPasswordRequest, UpdatePersonInfoRequest } from '../../model/dto';


export class PersonRepository extends BaseRepository {

  private _resetCodeRepository: Repository<PasswordResetCode> = this.connection.getRepository(PasswordResetCode);
  private _validateEmailRepository: Repository<EmailValidationCode> = this.connection.getRepository(EmailValidationCode);
  private _validatePhoneRepository: Repository<PhoneValidationCode> = this.connection.getRepository(PhoneValidationCode);
  private _personRepository: Repository<Person>  = this.connection.getRepository(Person);

  public async getPersonByEmail(email: string): Promise<Person | undefined> {
    return this._personRepository.findOne({email: email});
  }

  public async getPersonByPhone(phone: string): Promise<Person | undefined> {
    return this._personRepository.findOneOrFail({phone: phone});
  }
  
  public async validateEmail(code: string): Promise<Person> {
    
    const activationCode = await this._validateEmailRepository.findOne(code, {relations: ["person"]});

    if (!activationCode)
      throw new exception.EmailValidationCodeNotFoundException(code);

    let person = activationCode.person;
    person.setEmailValidated();
    return await this._personRepository.save(person);

  }

  public async validatePhone(code: string): Promise<Person> {

    const activationCode = await this._validatePhoneRepository.findOne(code, {relations: ["person"]});

    if (!activationCode)
      throw new exception.PhoneValidationCodeNotFoundException(code);

    let person = activationCode.person;
    person.setPhoneValidated();
    return await this._personRepository.save(person);

  }

  public async resetPassword(code: string, resetPasswordRequest: ResetPasswordRequest): Promise<Person> {

    const passwordResetRequestCode = await this._resetCodeRepository.findOne(code, {relations: ["person"]});

    if (!passwordResetRequestCode)
      throw new exception.PasswordResetCodeNotFoundException(code);
    if (passwordResetRequestCode.expiryDate < DateUtils.now())
      throw new exception.PasswordResetCodeExpiredException(code);

    const person: Person = passwordResetRequestCode.person;

    if (!bcrypt.compareSync(resetPasswordRequest.oldPassword, person.passwordHash))
      throw new exception.WrongPasswordException();

    person.passwordHash = bcrypt.hashSync(resetPasswordRequest.newPassword, 10);

    await this._resetCodeRepository.delete(passwordResetRequestCode);
    await this._personRepository.save(person);

    return person;
  }

  public async createPasswordResetCode(person: Person): Promise<PasswordResetCode> {
    let code = PasswordResetCode.create(person);
    await this._resetCodeRepository.insert(code);
    return code;
  }

  public async createEmailValidationCode(person: Person): Promise<EmailValidationCode> {

    const activationCode = EmailValidationCode.create(person);
    await this._validateEmailRepository.insert(activationCode);
    return activationCode;

  }

  public async createPhoneValidationCode(person: Person): Promise<PhoneValidationCode> {

    const activationCode = PhoneValidationCode.create(person);
    await this._validatePhoneRepository.insert(activationCode);
    return activationCode;

  }

	public async updatePersonInfo(person: Person,request: UpdatePersonInfoRequest): Promise<void> {

    if (request.email) {
	    let personWithSameEmail = await this.getPersonByEmail(request.email);
	    if (personWithSameEmail)
	      throw new exception.EmailAlreadyExistsException(request.email);
    }

    if (request.phone) {
      let personWithSamePhone = await this.getPersonByPhone(request.phone);
      if (personWithSamePhone)
        throw new exception.PhoneAlreadyExists(request.phone);
    }

		person.email = request.email || person.email;
		person.phone = request.phone || person.phone;
		person.firstName = request.firstName || person.firstName;
		person.lastName = request.lastName || person.lastName;

		await this._personRepository.save(person);

	}

}