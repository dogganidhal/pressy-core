import { Member } from "../../model/entity/users/member";
import { MobileDeviceDto } from "../../model/dto";
import { MobileDevice } from "../../model/entity/users/device";
import { Person } from "../../model/entity/users/person";


export interface IMemberRepository {

  getAllMembers(): Promise<Member[]>;
  insertMember(member: Member): Promise<Member>;
  getMemberById(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getMemberByPhone(phone: string): Promise<Member | undefined>;
  deleteMemberByEmail(email: string): Promise<void>;
  getMobileDevices(member: Member): Promise<MobileDevice[]>;
  registerMobileDevice(member: Member, mobileDeviceDTO: MobileDeviceDto): Promise<MobileDevice>;
  deleteMobileDevice(person: Person, mobileDeviceDTO: MobileDeviceDto): Promise<void>;
  
}