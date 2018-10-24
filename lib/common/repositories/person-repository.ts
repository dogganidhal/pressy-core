import { MobileDevice } from './../model/entity/users/device';
import { PaymentAccount } from './../model/entity/users/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from '../model/dto/member';
import { Repository, createConnection } from "typeorm";
import bcrypt from "bcrypt";
import { MemberRegistrationDTO, PersonPasswordResetRequestDTO, MemberInfoDTO } from "../model/dto/member";
import { Exception } from "../errors";
import { DateUtils } from "../utils";
import { Member, PersonActivationCode } from '../model/entity/users/member';
import { Person } from '../model/entity/users/person';
import { PersonPasswordResetCode } from '../model/entity/users/reset-code';


export class PersonRepository {

  public static instance: PersonRepository = new PersonRepository();

  private _memberRepositoryPromise: Promise<Repository<Member>>;
  private _resetCodeRepositoryPromise: Promise<Repository<PersonPasswordResetCode>>;
  private _activationCodeRepositoryPromise: Promise<Repository<PersonActivationCode>>;
  private _paymentAccountRepositoryPromise: Promise<Repository<PaymentAccount>>;
  private _mobileDeviceRepositoryPromise: Promise<Repository<MobileDevice>>;
  private _personRepositoryPromise: Promise<Repository<Person>>;

  constructor() {
    this._memberRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
        .then(connection => resolve(connection.getRepository(Member)))
        .catch(error => reject(error));
    });
    this._resetCodeRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(PersonPasswordResetCode)))
      .catch(error => reject(error));
    });
    this._activationCodeRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(PersonActivationCode)))
      .catch(error => reject(error));
    });
    this._personRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(Person)))
      .catch(error => reject(error));
    });
  }

  public async savePerson(person: Person): Promise<Person> {
    const personRepository = await this._personRepositoryPromise;
    return personRepository.save(person);
  }

  public async getPersonById(id: number): Promise<Person | undefined> {
    return (await this._personRepositoryPromise).findOne(id);
  }

  public async getPersonByEmail(email: string): Promise<Person | undefined> {
    const personRepository = await this._personRepositoryPromise;
    return personRepository.findOneOrFail({email: email});
  }

  public async getPersonByPhone(phone: string): Promise<Person | undefined> {
    const personRepository = await this._personRepositoryPromise;
    return personRepository.findOneOrFail({phone: phone});
  }
  
  public async getActivationCodePerson(code: string): Promise<Person> {
    
    const activationCodeRepository = await this._activationCodeRepositoryPromise;
    const activationCode = await activationCodeRepository.findOne(code, {relations: []});

    if (!activationCode)
      throw new Exception.ActivationCodeNotFound(code);

    return activationCode.person;

  }

  public async resetPassword(code: string, resetPasswordRequest: PersonPasswordResetRequestDTO): Promise<Person> {

    const resetCodeRepository = await this._resetCodeRepositoryPromise;
    const personRepository = await this._personRepositoryPromise;
    const passwordResetRequestCode = await resetCodeRepository.findOne(code, {relations: ["person"]});

    if (!passwordResetRequestCode)
      throw new Exception.PasswordResetCodeNotFound(code);
    if (passwordResetRequestCode.expiryDate < DateUtils.now())
      throw new Exception.PasswordResetCodeExpired(code);

    const person: Person = passwordResetRequestCode.person;

    if (!bcrypt.compareSync(resetPasswordRequest.oldPassword, person.passwordHash))
      throw new Exception.WrongPassword();

    person.passwordHash = bcrypt.hashSync(resetPasswordRequest.newPassword, 10);

    await resetCodeRepository.delete(passwordResetRequestCode);
    await personRepository.save(person);

    return person;
  }

  public async createPasswordResetCode(person: Person): Promise<PersonPasswordResetCode> {
    const code = PersonPasswordResetCode.create(person);
    return (await this._resetCodeRepositoryPromise).save(code);
  }

  public async deletePasswordResetCode(passwordResetCode: PersonPasswordResetCode): Promise<void> {
    (await this._resetCodeRepositoryPromise).delete(passwordResetCode);
  }

  public async createActivationCode(person: Person): Promise<PersonActivationCode> {

    const activationCode = PersonActivationCode.create(person);
    return (await this._activationCodeRepositoryPromise).save(activationCode);

  }

  public async deleteActivationCode(code: string): Promise<void> {

    const activationCodeRepository = await this._activationCodeRepositoryPromise;
    const resetCodeRepository = await this._resetCodeRepositoryPromise;
    const activationCode = await activationCodeRepository.findOne(code);

    if (!activationCode)
      throw new Exception.ActivationCodeNotFound(code);

    resetCodeRepository.createQueryBuilder()
      .delete()
      .from(PersonActivationCode)
      .where("code = :code", {code: code})
      .execute();

  }

}