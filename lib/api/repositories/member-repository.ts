import { MobileDevice } from './../model/entity/members/device';
import { PaymentAccount } from './../model/entity/members/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from './../model/dto/index';
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { Member, MemberPasswordResetCode, MemberActivationCode, MemberGroup } from "../model/entity";
import { connectToDatabase } from "../db";
import { MemberRegistrationDTO, MemberPasswordResetRequestDTO, MemberInfoDTO } from "../model/dto";
import { Exception } from "../errors";
import { DateUtils } from "../utils";


export class MemberRepository {

  public static instance: MemberRepository = new MemberRepository();

  private _memberRepositoryPromise: Promise<Repository<Member>>;
  private _resetCodeRepositoryPromise: Promise<Repository<MemberPasswordResetCode>>;
  private _activationCodeRepositoryPromise: Promise<Repository<MemberActivationCode>>;
  private _paymentAccountRepositoryPromise: Promise<Repository<PaymentAccount>>;
  private _mobileDeviceRepositoryPromise: Promise<Repository<MobileDevice>>;

  constructor() {
    this._memberRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(Member));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._resetCodeRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(MemberPasswordResetCode));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._activationCodeRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(MemberActivationCode));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._paymentAccountRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(PaymentAccount));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._mobileDeviceRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(MobileDevice));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async saveMember(member: Member): Promise<Member> {
    return (await this._memberRepositoryPromise).save(member);
  }

  public async getAllMembers(): Promise<Member[]> {
    return (await this._memberRepositoryPromise).find();
  }

  public async getMemberById(id: number): Promise<Member | undefined> {
    return (await this._memberRepositoryPromise).findOne(id);
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {
    return (await this._memberRepositoryPromise).findOne({email: email});
  }

  public async createMember(memberDTO: MemberRegistrationDTO): Promise<Member> {

    const memberWithSameEmail = await (await this._memberRepositoryPromise).find({email: memberDTO.email});
    if (memberWithSameEmail.length > 0)
      throw new Exception.EmailAlreadyExists(memberDTO.email);

    const memberWithSamePhone = await (await this._memberRepositoryPromise).find({phone: memberDTO.phone});
    if (memberWithSamePhone.length > 0)
      throw new Exception.PhoneAlreadyExists(memberDTO.phone);

    const newMember = Member.create(memberDTO);

    return (await this._memberRepositoryPromise).save(newMember);

  }

  public async resetPassword(code: string, resetPasswordRequest: MemberPasswordResetRequestDTO): Promise<Member> {
    const passwordResetRequestCode = await (await (await this._resetCodeRepositoryPromise)).findOne(code, {relations: ["member"]});

    if (passwordResetRequestCode == undefined)
      throw new Exception.PasswordResetCodeNotFound(code);
    if (passwordResetRequestCode!.expiryDate! < DateUtils.now())
      throw new Exception.PasswordResetCodeExpired(code);

    const member = passwordResetRequestCode!.member!;

    if (!bcrypt.compareSync(resetPasswordRequest.oldPassword, member.passwordHash!))
      throw new Exception.WrongPassword();

    member.passwordHash = bcrypt.hashSync(resetPasswordRequest.newPassword, 10);

    (await this._resetCodeRepositoryPromise).delete(passwordResetRequestCode);
    return (await this._memberRepositoryPromise).save(member);
  }

  public async createPasswordResetCode(member: Member): Promise<MemberPasswordResetCode> {
    const code = MemberPasswordResetCode.create(member);
    return (await this._resetCodeRepositoryPromise).save(code);
  }

  public async deletePasswordResetCode(passwordResetCode: MemberPasswordResetCode): Promise<void> {
    (await this._resetCodeRepositoryPromise).delete(passwordResetCode);
  }

  public async createActivationCode(member: Member): Promise<MemberActivationCode> {

    const activationCode = MemberActivationCode.create(member);
    return (await this._activationCodeRepositoryPromise).save(activationCode);

  }

  public async getActivationCodeMember(code: string): Promise<Member> {

    const activationCode = await (await this._activationCodeRepositoryPromise).findOne(code, {relations: ["member"]});

    if (!activationCode)
      throw new Exception.ActivationCodeNotFound(code);

    return activationCode.member;

  }

  public async deleteActivationCode(code: string): Promise<void> {
    const activationCode = await (await this._activationCodeRepositoryPromise).findOne(code);
    if (!activationCode)
      throw new Exception.ActivationCodeNotFound(code);
    await (await this._resetCodeRepositoryPromise)
      .createQueryBuilder()
      .delete()
      .from(MemberActivationCode)
      .where("code = :code", {code: code})
      .execute();
  }

  public async createDriver(memberDTO: MemberRegistrationDTO) {

    const memberWithSameEmail = await (await this._memberRepositoryPromise).find({email: memberDTO.email});
    if (memberWithSameEmail.length > 0)
      throw new Exception.EmailAlreadyExists(memberDTO.email);

    const memberWithSamePhone = await (await this._memberRepositoryPromise).find({phone: memberDTO.phone});
    if (memberWithSamePhone.length > 0)
      throw new Exception.PhoneAlreadyExists(memberDTO.phone);

    const newDriver = Member.create(memberDTO);
    newDriver.group = MemberGroup.DRIVER;

    return (await this._memberRepositoryPromise).save(newDriver);
    
  }

  public async getPaymentAccounts(member: Member): Promise<PaymentAccount[]> {
    const repository = await this._paymentAccountRepositoryPromise;
    return repository.find({member: member});
  }

  public async addPaymentAccount(member: Member, creditCardDTO: CreditCardDTO): Promise<PaymentAccount> {

    const repository = await this._paymentAccountRepositoryPromise;
    const paymentAccount = PaymentAccount.create(member, creditCardDTO);

    return repository.save(paymentAccount);

  }

  public async getMobileDevices(member: Member): Promise<MobileDevice[]> {

    const repository = await this._mobileDeviceRepositoryPromise;
    return repository.find({member: member});

  }

  public async registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDTO): Promise<MobileDevice> {

    const repository = await this._mobileDeviceRepositoryPromise;
    const device = MobileDevice.create(member, mobileDeviceDTO.deviceId);

    return repository.save(device);

  }

}