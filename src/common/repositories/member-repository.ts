import {MobileDevice} from './../model/entity/users/device';
import {Repository} from "typeorm";
import {Exception} from "../errors";
import {Member, PersonActivationCode} from '../model/entity/users/member';
import {Person} from '../model/entity/users/person';
import {BaseRepository} from './base-repository';
import * as DTO from "../model/dto";


export class MemberRepository extends BaseRepository {

  private _memberRepository: Repository<Member> = this.connection.getRepository(Member);
  private _mobileDeviceRepository: Repository<MobileDevice> = this.connection.getRepository(MobileDevice);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);
  private _personActivationCodeRepository: Repository<PersonActivationCode> = this.connection.getRepository(PersonActivationCode);

  public async getAllMembers(): Promise<Member[]> {
    return (await this._memberRepository).find();
  }

  public async getMemberFromPerson(person:Person): Promise<Member | undefined> {
    return await this._memberRepository.findOne({person: person}, {relations: ["person"]});
  }

	public async getMemberFromPersonOrFail(person:Person): Promise<Member> {
		return await this._memberRepository.findOneOrFail({person: person}, {relations: ["person"]});
	}

  public async getMemberById(id: number): Promise<Member | undefined> {
    return this._memberRepository.findOne(id, {relations: ["person"]});
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: person}, {relations: ["person"]});
    
  }

  public async getMemberByPhone(phone: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({phone: phone});
    
    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: {id: person.id}}, {relations: ["person"]});

  }

  public async createMember(createMemberRequest: DTO.member.CreateMemberRequest): Promise<Member> {

    const { email, phone } = createMemberRequest;

    if (!email)
      throw new Exception.MissingFieldsException("email");

    if (!phone)
	    throw new Exception.MissingFieldsException("phone");

    const memberWithSameEmail = await this.getMemberByEmail(email);
    if (memberWithSameEmail)
      throw new Exception.EmailAlreadyExistsException(email);

    const memberWithSamePhone = await this.getMemberByPhone(phone);
    if (memberWithSamePhone)
      throw new Exception.PhoneAlreadyExists(phone);

    const newMember = Member.create(createMemberRequest);

    await this._personRepository.insert(newMember.person);
	  await this._memberRepository.insert(newMember);

    return newMember;

  }
  
  public async deleteMemberByEmail(email: string): Promise<void> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return;

    const personActivationCode = await this._personActivationCodeRepository.findOne({person: person});
    const member = await this._memberRepository.findOne({person: person});

    if (personActivationCode)
      await this._personActivationCodeRepository.delete(personActivationCode);

    if (member)
	    await this._memberRepository.delete(member);

    await this._personRepository.delete(person);

  }

  public async getMobileDevices(member: Member): Promise<MobileDevice[]> {

    return this._mobileDeviceRepository.find({member: member});

  }

  public async registerMobileDevice(member: Member, mobileDeviceDTO: DTO.member.MobileDevice): Promise<MobileDevice> {

    const device = MobileDevice.create(member, mobileDeviceDTO.deviceId);
    await this._mobileDeviceRepository.insert(device);
    return device;

  }

}