import { MobileDevice } from './../model/entity/users/device';
import { PaymentAccount } from './../model/entity/users/payment-account';
import { CreditCardDTO, MobileDeviceDTO } from '../model/dto/member';
import { Repository, createConnection, Equal } from "typeorm";
import { MemberRegistrationDTO } from "../model/dto/member";
import { Exception } from "../errors";
import { Member } from '../model/entity/users/member';
import { Person } from '../model/entity/users/person';
import { ARepository } from '.';


export class MemberRepository extends ARepository {

  public static instance: MemberRepository = new MemberRepository();

  private _memberRepositoryPromise: Promise<Repository<Member>>;
  private _paymentAccountRepositoryPromise: Promise<Repository<PaymentAccount>>;
  private _mobileDeviceRepositoryPromise: Promise<Repository<MobileDevice>>;
  private _personRepositoryPromise: Promise<Repository<Person>>;

  constructor() {
    super();
    this._memberRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
        .then(connection => resolve(connection.getRepository(Member)))
        .catch(error => reject(error));
    });
    this._paymentAccountRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(PaymentAccount)))
      .catch(error => reject(error));
    });
    this._mobileDeviceRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(MobileDevice)))
      .catch(error => reject(error));
    });
    this._personRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => resolve(connection.getRepository(Person)))
      .catch(error => reject(error));
    });
  }

  public close(): void {
    this._personRepositoryPromise.then(repo => repo.manager.connection.close());
    this._memberRepositoryPromise.then(repo => repo.manager.connection.close());
    this._mobileDeviceRepositoryPromise.then(repo => repo.manager.connection.close());
    this._paymentAccountRepositoryPromise.then(repo => repo.manager.connection.close());
  }

  public async saveMember(member: Member): Promise<Member> {
    const memberRepository = await this._memberRepositoryPromise;
    const personRepository = await this._personRepositoryPromise;
    await personRepository.save(member.person);
    return memberRepository.save(member);
  }

  public async getAllMembers(): Promise<Member[]> {
    return (await this._memberRepositoryPromise).find();
  }

  public async getMemberById(id: number): Promise<Member | undefined> {
    return (await this._memberRepositoryPromise).findOne(id);
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {
    const memberRepository = await this._memberRepositoryPromise;
    const personRepository = await this._personRepositoryPromise;
    const person = await personRepository.findOne({email: email});
    if (!person)
      return undefined;
    const member = await memberRepository.findOne({person: {id: person.id}}, {relations: ["person"]});
    return member;
  }

  public async getMemberByPhone(phone: string): Promise<Member | undefined> {
    const memberRepository = await this._memberRepositoryPromise;
    return memberRepository.findOne({person: {phone: phone}}, {relations: ["person"]});
  }

  public async createMember(memberDTO: MemberRegistrationDTO): Promise<Member> {

    const personRepository = await this._personRepositoryPromise;
    const memberRepository = await this._memberRepositoryPromise;

    const memberWithSameEmail = await this.getMemberByEmail(memberDTO.email);
    if (memberWithSameEmail)
      throw new Exception.EmailAlreadyExists(memberDTO.email);

    const memberWithSamePhone = await this.getMemberByPhone(memberDTO.phone);
    if (memberWithSamePhone)
      throw new Exception.PhoneAlreadyExists(memberDTO.phone);

    const newMember = Member.create(memberDTO);

    await personRepository.save(newMember.person);

    return memberRepository.save(newMember);

  }
  
  public async deleteMemberByEmail(email: string): Promise<void> {
    const memberRepository = await this._memberRepositoryPromise;
    const personRepository = await this._personRepositoryPromise;

    const person = await personRepository.findOne({email: email});

    if (!person)
      return;
      
    await memberRepository.delete({person: {id: person.id}});
    await personRepository.delete({id: person.id});
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