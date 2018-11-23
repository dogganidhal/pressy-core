import {BaseRepository} from '../base-repository';
import {PasswordResetCode} from '../../model/entity/users/password-reset-code';
import {Repository} from "typeorm";
import bcrypt from "bcrypt";
import {exception} from "../../errors";
import {DateUtils} from "../../utils";
import {ActivationCode, Person, PersonStatus} from '../../model/entity/users/person';
import * as DTO from "../../model/dto/index";
import {Member} from "../../model/entity/users/member/member";
import {person} from "../../model/dto/index";
import {Driver} from "../../model/entity/users/driver/driver";
import {MemberRepository} from "./member-repository";
import {IUser} from "../../model/entity/users";


export class PersonRepository extends BaseRepository {

  private _resetCodeRepository: Repository<PasswordResetCode> = this.connection.getRepository(PasswordResetCode);
  private _activationCodeRepository: Repository<ActivationCode> = this.connection.getRepository(ActivationCode);
  private _personRepository: Repository<Person>  = this.connection.getRepository(Person);

  public async savePerson(person: Person): Promise<Person> {
    return this._personRepository.save(person);
  }

  public async getPersonById(id: number): Promise<Person | undefined> {
    return this._personRepository.findOne(id);
  }

  public async getPersonByEmail(email: string): Promise<Person | undefined> {
    return this._personRepository.findOne({email: email});
  }

  public async getPersonByPhone(phone: string): Promise<Person | undefined> {
    return this._personRepository.findOneOrFail({phone: phone});
  }
  
  public async getActivationCodePerson(code: string): Promise<Person> {
    
    const activationCode = await this._activationCodeRepository.findOne(code, {relations: []});

    if (!activationCode)
      throw new exception.ActivationCodeNotFoundException(code);

    return activationCode.person;

  }

  public async resetPassword(code: string, resetPasswordRequest: DTO.person.ResetPasswordRequest): Promise<Person> {

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

  public async deletePasswordResetCode(passwordResetCode: PasswordResetCode): Promise<void> {
    await this._resetCodeRepository.delete(passwordResetCode);
  }

  public async createActivationCode(person: Person): Promise<ActivationCode> {

    const activationCode = ActivationCode.create(person);
    await this._activationCodeRepository.insert(activationCode);
    return activationCode;

  }

	public async updatePersonInfo(person: Person,request: person.UpdatePersonInfoRequest): Promise<void> {

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

  public async activatePerson(person: Person, activationCode: ActivationCode): Promise<void> {

    if (activationCode.person.id !== person.id)
      throw new exception.ActivationCodeNotFoundException(activationCode.code);

    person.status = PersonStatus.ACTIVE;
    await this._personRepository.save(person);

  }

  public async deleteActivationCode(code: string): Promise<void> {

    const activationCode = await this._activationCodeRepository.findOne(code);

    if (!activationCode)
      throw new exception.ActivationCodeNotFoundException(code);

      await this._resetCodeRepository.createQueryBuilder()
      .delete()
      .from(ActivationCode)
      .where("code = :code", {code: code})
      .execute();

  }

  /**
   * Gets Member / Driver / Admin from a Person
   */
  public async getUserWithPerson(person: Person): Promise<IUser | undefined> {

    let memberRepository = this.connection.getRepository(Member);
	  let driverRepository = this.connection.getRepository(Driver);

    let member = await memberRepository.findOne({person: person});
    let driver = await driverRepository.findOne({person: person});
    // TODO: Add other segments of users

    if (member)
      return member;

    if (driver)
      return driver;

  }

}