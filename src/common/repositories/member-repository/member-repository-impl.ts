import {MobileDevice} from '../../model/entity/users/device';
import {Repository} from "typeorm";
import {exception} from "../../errors";
import {Member} from '../../model/entity/users/member';
import {EmailValidationCode, Person, PhoneValidationCode} from '../../model/entity/users/person';
import {BaseRepository} from '../base-repository';
import {validation} from "../../utils";
import { CreatePersonRequestDto, MobileDeviceDto } from '../../model/dto';
import { IMemberRepository } from '.';


export class MemberRepositoryImpl extends BaseRepository implements IMemberRepository {

  private _memberRepository: Repository<Member> = this.connection.getRepository(Member);
  private _mobileDeviceRepository: Repository<MobileDevice> = this.connection.getRepository(MobileDevice);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);
  private _emailValidationCodeRepository: Repository<EmailValidationCode> = this.connection.getRepository(EmailValidationCode);
  private _phoneValidationCodeRepository: Repository<PhoneValidationCode> = this.connection.getRepository(PhoneValidationCode);

  public async getMemberById(id: number): Promise<Member | undefined> {
    return await this._memberRepository.findOne(id, {relations: ["person", "addresses", "paymentAccounts"]});
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({email: email.toLowerCase()});

    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: person}, {relations: ["person", "addresses", "paymentAccounts"]});
    
  }

  public async getMemberByPhone(phone: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({phone: phone});
    
    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: {id: person.id}}, {relations: ["person", "addresses", "paymentAccounts"]});

  }

  public async insertMember(member: Member): Promise<Member> {
    await this._personRepository.insert(member.person);
    return await this._memberRepository.save(member);
  }
  
  public async deleteMemberByEmail(email: string): Promise<void> {

    const person = await this._personRepository.findOne({email: email.toLowerCase()});

    if (!person)
      return;

    const emailValidationCode = await this._emailValidationCodeRepository.findOne({person: person});
    const phoneValidationCode = await this._phoneValidationCodeRepository.findOne({person: person});
    const member = await this._memberRepository.findOne({person: person}, {relations: ["person", "addresses"]});

    if (member) {
	    let mobileDevices = await this.getMobileDevices(member);
	    mobileDevices.map(async mobileDevice => await this._mobileDeviceRepository.delete(mobileDevice));
    }

    if (emailValidationCode)
      await this._emailValidationCodeRepository.delete(emailValidationCode);

    if (phoneValidationCode)
      await this._phoneValidationCodeRepository.delete(phoneValidationCode);

    if (member)
	    await this._memberRepository.delete(member);

    await this._personRepository.delete(person);

  }

  public async getMobileDevices(member: Member): Promise<MobileDevice[]> {

    return this._mobileDeviceRepository.find({person: member.person});

  }

  public async registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDto): Promise<MobileDevice> {

    const device = MobileDevice.create(member.person, mobileDeviceDTO.deviceId);
    await this._mobileDeviceRepository.insert(device);
    return device;

  }

  public async deleteMobileDevice(person: Person, mobileDeviceDTO: MobileDeviceDto): Promise<void> {

    let mobileDevice = await this._mobileDeviceRepository.findOne(mobileDeviceDTO.deviceId, {relations: ["person"]});

    if (!mobileDevice)
      throw new exception.MobileDeviceNotFoundException(mobileDeviceDTO.deviceId);

    if (mobileDevice.person.id != person.id)
      throw new exception.CannotDeleteMobileDeviceException(mobileDeviceDTO.deviceId);

    await this._mobileDeviceRepository.delete({id: mobileDeviceDTO.deviceId});

  }

}