import { BaseRepository } from './base-repository';
import { PersonPasswordResetCode } from '../model/entity/users/reset-code';
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { Exception } from "../errors";
import { DateUtils } from "../utils";
import { PersonActivationCode } from '../model/entity/users/member';
import { Person } from '../model/entity/users/person';
import * as DTO from "../model/dto";


export class PersonRepository extends BaseRepository {

  private _resetCodeRepository: Repository<PersonPasswordResetCode> = this.connection.getRepository(PersonPasswordResetCode);
  private _activationCodeRepository: Repository<PersonActivationCode> = this.connection.getRepository(PersonActivationCode);
  private _personRepository: Repository<Person>  = this.connection.getRepository(Person);

  public async savePerson(person: Person): Promise<Person> {
    return this._personRepository.save(person);
  }

  public async getPersonById(id: number): Promise<Person | undefined> {
    return this._personRepository.findOne(id);
  }

  public async getPersonByEmail(email: string): Promise<Person | undefined> {
    return this._personRepository.findOneOrFail({email: email});
  }

  public async getPersonByPhone(phone: string): Promise<Person | undefined> {
    return this._personRepository.findOneOrFail({phone: phone});
  }
  
  public async getActivationCodePerson(code: string): Promise<Person> {
    
    const activationCode = await this._activationCodeRepository.findOne(code, {relations: []});

    if (!activationCode)
      throw new Exception.ActivationCodeNotFoundException(code);

    return activationCode.person;

  }

  public async resetPassword(code: string, resetPasswordRequest: DTO.member.ResetPasswordRequest): Promise<Person> {

    const passwordResetRequestCode = await this._resetCodeRepository.findOne(code, {relations: ["person"]});

    if (!passwordResetRequestCode)
      throw new Exception.PasswordResetCodeNotFoundException(code);
    if (passwordResetRequestCode.expiryDate < DateUtils.now())
      throw new Exception.PasswordResetCodeExpiredException(code);

    const person: Person = passwordResetRequestCode.person;

    if (!bcrypt.compareSync(resetPasswordRequest.oldPassword, person.passwordHash))
      throw new Exception.WrongPasswordException();

    person.passwordHash = bcrypt.hashSync(resetPasswordRequest.newPassword, 10);

    await this._resetCodeRepository.delete(passwordResetRequestCode);
    await this._personRepository.save(person);

    return person;
  }

  public async createPasswordResetCode(person: Person): Promise<PersonPasswordResetCode> {
    let code = PersonPasswordResetCode.create(person);
    await this._resetCodeRepository.insert(code);
    return code;
  }

  public async deletePasswordResetCode(passwordResetCode: PersonPasswordResetCode): Promise<void> {
    await this._resetCodeRepository.delete(passwordResetCode);
  }

  public async createActivationCode(person: Person): Promise<PersonActivationCode> {

    const activationCode = PersonActivationCode.create(person);
    await this._activationCodeRepository.insert(activationCode);
    return activationCode;

  }

  public async deleteActivationCode(code: string): Promise<void> {

    const activationCode = await this._activationCodeRepository.findOne(code);

    if (!activationCode)
      throw new Exception.ActivationCodeNotFoundException(code);

      await this._resetCodeRepository.createQueryBuilder()
      .delete()
      .from(PersonActivationCode)
      .where("code = :code", {code: code})
      .execute();

  }

}