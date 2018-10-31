import {MobileDevice} from './../model/entity/users/device';
import {MemberRegistrationDTO, MobileDeviceDTO} from '../model/dto/member';
import {Repository} from "typeorm";
import {Exception} from "../errors";
import {Member, PersonActivationCode} from '../model/entity/users/member';
import {Person} from '../model/entity/users/person';
import {ARepository} from '.';
import {log} from "util";


export class MemberRepository extends ARepository {

  private _memberRepository: Repository<Member> = this.connection.getRepository(Member);
  private _mobileDeviceRepository: Repository<MobileDevice> = this.connection.getRepository(MobileDevice);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);
  private _personActivationCodeRepository: Repository<PersonActivationCode> = this.connection.getRepository(PersonActivationCode);

  public async saveMember(member: Member): Promise<Member> {
    await this._personRepository.save(member.person);
    return this._memberRepository.save(member);
  }

  public async getAllMembers(): Promise<Member[]> {
    return (await this._memberRepository).find();
  }

  public async getMemberById(id: number): Promise<Member | undefined> {
    return this._memberRepository.findOne(id);
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return undefined;

    return await this._memberRepository.findOne({person: {id: person.id}}, {relations: ["person"]});
    
  }

  public async getMemberByPhone(phone: string): Promise<Member | undefined> {

    const person = await this._personRepository.findOne({phone: phone});
    
    if (!person)
      return undefined;

    return this._memberRepository.findOne({person: {id: person.id}}, {relations: ["person"]});

  }

  public async createMember(memberDTO: MemberRegistrationDTO): Promise<Member> {

    const memberWithSameEmail = await this.getMemberByEmail(memberDTO.email);
    if (memberWithSameEmail)
      throw new Exception.EmailAlreadyExists(memberDTO.email);

    const memberWithSamePhone = await this.getMemberByPhone(memberDTO.phone);
    if (memberWithSamePhone)
      throw new Exception.PhoneAlreadyExists(memberDTO.phone);

    const newMember = Member.create(memberDTO);

    await this._personRepository.save(newMember.person);

    return this._memberRepository.save(newMember);

  }
  
  public async deleteMemberByEmail(email: string): Promise<void> {

    const person = await this._personRepository.findOne({email: email});

    if (!person)
      return;

    const personActivationCode = await this._personActivationCodeRepository.findOne({person: person});
      
    await this._memberRepository.delete({person: person});
    if (personActivationCode)
      await this._personActivationCodeRepository.delete(personActivationCode);

    await this._personRepository.delete({id: person.id});
  }

  public async getMobileDevices(member: Member): Promise<MobileDevice[]> {

    return this._mobileDeviceRepository.find({member: member});

  }

  public async registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDTO): Promise<MobileDevice> {

    const device = MobileDevice.create(member, mobileDeviceDTO.deviceId);
    return this._mobileDeviceRepository.save(device);

  }

}