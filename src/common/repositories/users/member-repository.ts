import {MobileDevice} from '../../model/entity/users/device';
import {Repository} from "typeorm";
import {exception} from "../../errors";
import {Member} from '../../model/entity/users/member/member';
import {ActivationCode, Person} from '../../model/entity/users/person';
import {BaseRepository} from '../base-repository';
import {validation} from "../../utils";
import { CreatePersonRequest, MobileDevice as MobileDeviceDTO } from '../../model/dto';


export class MemberRepository extends BaseRepository {

  private _memberRepository: Repository<Member> = this.connection.getRepository(Member);
  private _mobileDeviceRepository: Repository<MobileDevice> = this.connection.getRepository(MobileDevice);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);
  private _activationCodeRepository: Repository<ActivationCode> = this.connection.getRepository(ActivationCode);

  public async getMemberFromPerson(person:Person): Promise<Member | undefined> {
    return await this._memberRepository.findOne({person: person}, {relations: ["person", "addresses"]});
  }

	public async getMemberFromPersonOrFail(person:Person): Promise<Member> {
		return await this._memberRepository.findOneOrFail({person: person}, {relations: ["person", "addresses"]});
	}

  public async getMemberByEmail(email: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: person}, {relations: ["person", "addresses"]});
    
  }

  public async getMemberByPhone(phone: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({phone: phone});
    
    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: {id: person.id}}, {relations: ["person", "addresses"]});

  }

  public async createMember(createMemberRequest: CreatePersonRequest): Promise<Member> {

    const { email, phone, password } = createMemberRequest;

    if (!email)
      throw new exception.MissingFieldsException("email");

    if (!phone)
	    throw new exception.MissingFieldsException("phone");

    if (!validation.validateEmail(email))
      throw new exception.InvalidEmailException(email);

    if (!validation.validatePhoneNumber(phone))
      throw new exception.InvalidPhoneException(phone);

    let invalidPasswordReason = validation.validatePassword(password);
	  if (invalidPasswordReason != null)
		  throw new exception.InvalidPasswordException(invalidPasswordReason);

    const memberWithSameEmail = await this.getMemberByEmail(email);
    if (memberWithSameEmail)
      throw new exception.EmailAlreadyExistsException(email);

    const memberWithSamePhone = await this.getMemberByPhone(phone);
    if (memberWithSamePhone)
      throw new exception.PhoneAlreadyExists(phone);

    const newMember = Member.create(createMemberRequest);

    await this._personRepository.insert(newMember.person);
	  await this._memberRepository.insert(newMember);

    return newMember;

  }
  
  public async deleteMemberByEmail(email: string): Promise<void> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return;

    const activationCode = await this._activationCodeRepository.findOne({person: person});
    const member = await this._memberRepository.findOne({person: person}, {relations: ["person", "addresses"]});

    if (member) {
	    let mobileDevices = await this.getMobileDevices(member);
	    mobileDevices.map(async mobileDevice => await this._mobileDeviceRepository.delete(mobileDevice));
    }

    if (activationCode)
      await this._activationCodeRepository.delete(activationCode);

    if (member)
	    await this._memberRepository.delete(member);

    await this._personRepository.delete(person);

  }

  public async getMobileDevices(member: Member): Promise<MobileDevice[]> {

    return this._mobileDeviceRepository.find({person: member.person});

  }

  public async registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDTO): Promise<MobileDevice> {

    const device = MobileDevice.create(member.person, mobileDeviceDTO.deviceId);
    await this._mobileDeviceRepository.insert(device);
    return device;

  }

  public async deleteMobileDevice(person: Person, mobileDeviceDTO: MobileDeviceDTO): Promise<void> {

    let mobileDevice = await this._mobileDeviceRepository.findOne(mobileDeviceDTO.deviceId, {relations: ["person"]});

    if (!mobileDevice)
      throw new exception.MobileDeviceNotFoundException(mobileDeviceDTO.deviceId);

    if (mobileDevice.person.id != person.id)
      throw new exception.CannotDeleteMobileDeviceException(mobileDeviceDTO.deviceId);

    await this._mobileDeviceRepository.delete({id: mobileDeviceDTO.deviceId});

  }

}