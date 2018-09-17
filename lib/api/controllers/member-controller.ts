import { 
  Path, GET, PathParam, POST,
  HttpError, Errors, Return 
} from "typescript-rest";
import { JsonConvert } from "json2typescript";
import MemberRepository from "../repositories";
import { 
  MemberRegistrationDTO, MemberPasswordResetCodeDTO, 
  MemberPasswordResetCodeRequestDTO, 
  MemberPasswordResetRequestDTO
} from "../model/dto";
import { Controller } from ".";
import { Exception } from "../errors";

@Path('/api/v1/member/')
export class MemberController extends Controller {

  private _repository: MemberRepository = MemberRepository.instance;

  @GET
  public async getAllMembers() {
    return await this._repository.getAllMembers();
  }

  @Path("/:id/")
  @GET
  public async getMemberInfos(@PathParam("id") id: number) {
    return await this._repository.getMemberById(id);
  }

  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

    try {

      const jsonObject = JSON.parse(this.currentRequest!.body);
      const convert = new JsonConvert();
      const resetCodeRequest = convert
        .deserialize(jsonObject, MemberPasswordResetCodeRequestDTO);

      const member = await this._repository
        .getMemberByEmail(resetCodeRequest.email);

      if (member == undefined) {
        this.throw(new Exception.MemberNotFound(member!.email!));
        return;
      }
      
      const resetCode = await this._repository.createPasswordResetCode(member);
      const resetCodeDTO = MemberPasswordResetCodeDTO.create(resetCode);

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
      const member = await this._repository.resetPassword(code, resetPasswordRequest);

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

      const jsonObject = JSON.parse(this.currentRequest!.body);
      const convert = new JsonConvert();
      const newMember: MemberRegistrationDTO = convert
        .deserialize(jsonObject, MemberRegistrationDTO);
      
      return this._repository.createMember(newMember);

    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));

    }

  }

}