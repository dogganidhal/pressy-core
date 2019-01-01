import { Member } from "../../model/entity/users/member";
import { CreatePersonRequestDto, MobileDeviceDto } from "../../model/dto";
import { MobileDevice } from "../../model/entity/users/device";
import { Person } from "../../model/entity/users/person";


export interface IMemberRepository {

  getMemberById(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getMemberByPhone(phone: string): Promise<Member | undefined>;
  createMember(createMemberRequest: CreatePersonRequestDto): Promise<Member>;
  deleteMemberByEmail(email: string): Promise<void>;
  getMobileDevices(member: Member): Promise<MobileDevice[]>;
  registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDto): Promise<MobileDevice>;
  deleteMobileDevice(person: Person, mobileDeviceDTO: MobileDeviceDto): Promise<void>;
  
}