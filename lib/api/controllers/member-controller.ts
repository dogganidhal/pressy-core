import {
  Path, GET, POST,
  HttpError, Errors, PathParam, Return 
} from "typescript-rest";
import { MemberRepository } from "../repositories";
import {
  MemberRegistrationDTO,MemberInfoDTO
} from "../model/dto";
import { Controller, Authenticated } from ".";
import { AccessPrivilege } from "../model/entity/auth";
import { HTTPUtils } from "../utils/http-utils";
import { JSONSerialization } from "../utils/json-serialization";
import { Member, MemberStatus } from "../model/entity";

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
      const member = await this._memberRepository.createMember(newMember);
      const _ = this._memberRepository.createActivationCode(member);
      // TODO: Send the activation URL by email !!
      return JSONSerialization.serializeObject(newMember);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/activate/:code/")
  @GET
  public async activateMember(@PathParam("code") code: string) {

    try {
      const member = await this._memberRepository.getActivationCodeMember(code);
      member.status = MemberStatus.ACTIVE;
      
      await this._memberRepository.saveMember(member);

      return new Return.RequestAccepted(`/api/v1/member/${member.id}`);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }
    

  }

}