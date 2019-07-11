import { Member } from "../../model/entity/users/member";
import { CreatePersonRequestDto } from "../../model/dto";



export interface IMemberManager {
  createMember(createMemberRequest: CreatePersonRequestDto): Promise<Member>;
}