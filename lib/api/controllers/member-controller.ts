import {
  Path, GET, PathParam, POST,
  HttpError, Errors, Return 
} from "typescript-rest";
import { JsonConvert } from "json2typescript";
import { MemberRepository, AuthRepository } from "../repositories";
import {
  MemberRegistrationDTO, MemberPasswordResetCodeDTO, 
  MemberPasswordResetCodeRequestDTO, 
  MemberPasswordResetRequestDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  MemberInfoDTO
} from "../model/dto";
import { Controller, Authenticated } from ".";
import { Exception } from "../errors";
import { AccessPrivilege } from "../model/entity/auth";
import { HTTPUtils } from "../utils/http-utils";
import { JSONSerialization } from "../utils/json-serialization";
import { Member } from "../model/entity";

@Path('/api/v1/member/')
export class MemberController extends Controller {

  private _memberRepository: MemberRepository = MemberRepository.instance;
  private _authRepository: AuthRepository = AuthRepository.instance;

  @Authenticated(AccessPrivilege.SUPERUSER)
  @GET
  public async getAllMembers() {
    const members: Member[] = await this._memberRepository.getAllMembers();
    return members.map(member => JSONSerialization.serializeObject(MemberInfoDTO.create(member)));
  }

  @Authenticated(AccessPrivilege.BASIC)
  @Path("/:id/")
  @GET
  public async getMemberInfos(@PathParam("id") id: number) {
    console.log(this.currentUser);
    const member = await this._memberRepository.getMemberById(id);
    return JSONSerialization.serializeObject(MemberInfoDTO.create(member!));
  }

  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

    try {

      const jsonObject = JSON.parse(this.currentRequest!.body);
      const convert = new JsonConvert();
      const resetCodeRequest = convert
        .deserialize(jsonObject, MemberPasswordResetCodeRequestDTO);

      const member = await this._memberRepository
        .getMemberByEmail(resetCodeRequest.email);

      if (member == undefined) {
        this.throw(new Exception.MemberNotFound(member!.email!));
        return;
      }
      
      const resetCode = await this._memberRepository.createPasswordResetCode(member);
      const resetCodeDTO = MemberPasswordResetCodeDTO.create(resetCode);

      // TODO: Return an empty "accepted" response, and call the email service
      return convert.serialize(resetCodeDTO);

    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

    try {

      const jsonObject = JSON.parse(this.currentRequest!.body);
      const convert = new JsonConvert();
      const resetPasswordRequest = convert.deserialize(jsonObject, MemberPasswordResetRequestDTO);
      const member = await this._memberRepository.resetPassword(code, resetPasswordRequest);
      this._memberRepository.deletePasswordResetCode(resetPasswordRequest);

      return new Return.RequestAccepted(`/api/v1/member/${member.id}`);

    } catch (error) {
      if (error instanceof Error) 
        this.throw(new Errors.BadRequestError((error as Error).message));
      else if (error instanceof HttpError)
        this.throw(error);
    }

  }

  @POST
  public async createMember() {

    try {
      const newMember: MemberRegistrationDTO = HTTPUtils.parseBody(this, MemberRegistrationDTO);
      await this._memberRepository.createMember(newMember);

      return newMember;
    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/login/")
  @POST
  public async login() {

    try {

      const loginRequest = HTTPUtils.parseBody(this, LoginRequestDTO);
      const member = await this._memberRepository.getMemberByEmail(loginRequest.email!);

      if (!member)
        throw new Exception.MemberNotFound(loginRequest.email);

      const convert = new JsonConvert();
      const token = await this._authRepository.generateToken(member, AccessPrivilege.SUPERUSER);
      const loginResponse = LoginResponseDTO.create(token);
      
      return convert.serialize(loginResponse);

    } catch (error) {
      console.log(error);
      if (error instanceof Error)
        this.throw(new Errors.BadRequestError(error.message));  
      else if (error instanceof HttpError)
        this.throw(error);
    }

  }

}