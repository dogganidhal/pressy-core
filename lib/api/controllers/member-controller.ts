import {
  Path, GET, POST,
  HttpError, Errors 
} from "typescript-rest";
import { MemberRepository } from "../repositories";
import {
  MemberRegistrationDTO,MemberInfoDTO
} from "../model/dto";
import { Controller, Authenticated } from ".";
import { AccessPrivilege } from "../model/entity/auth";
import { HTTPUtils } from "../utils/http-utils";
import { JSONSerialization } from "../utils/json-serialization";
import { Member } from "../model/entity";

@Path('/api/v1/member/')
export class MemberController extends Controller {

  private _memberRepository: MemberRepository = MemberRepository.instance;

  @Path("/all/")
  @Authenticated(AccessPrivilege.SUPERUSER)
  @GET
  public async getAllMembers() {
    const members: Member[] = await this._memberRepository.getAllMembers();
    return members.map(member => JSONSerialization.serializeObject(MemberInfoDTO.create(member)));
  }

  @Authenticated(AccessPrivilege.BASIC)
  @GET
  public async getMemberInfos() {
    const member = this.currentUser;
    return JSONSerialization.serializeObject(MemberInfoDTO.create(member!));
  }

  @POST
  public async createMember() {

    try {
      const newMember: MemberRegistrationDTO = HTTPUtils.parseBody(this, MemberRegistrationDTO);
      await this._memberRepository.createMember(newMember);

      return JSONSerialization.serializeObject(newMember);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

}