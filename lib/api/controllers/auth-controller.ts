import {
  Path, POST,
  HttpError, Errors, Return, PathParam 
} from "typescript-rest";
import { MemberRepository, AuthRepository } from "../../common/repositories";
import {
  LoginRequestDTO,
  RefreshCredentialsRequestDTO,
  PersonPasswordResetRequestDTO,
  MemberPasswordResetCodeDTO,
  MemberPasswordResetCodeRequestDTO
} from "../../common/model/dto/member";
import { Controller } from "../../common/controller";
import { Exception } from "../../common/errors";
import { HTTPUtils } from "../../common/utils/http-utils";
import { JSONSerialization } from "../../common/utils/json-serialization";
import bcrypt from "bcrypt";
import { PersonRepository } from "../../common/repositories/person-repository";

@Path('/api/v1/auth/')
export class AuthController extends Controller {

  private _memberRepository: MemberRepository = MemberRepository.instance;
  private _personRepository: PersonRepository = PersonRepository.instance;
  private _authRepository: AuthRepository = AuthRepository.instance;

  @Path("/login/")
  @POST
  public async login() {

    try {

      const loginRequest = HTTPUtils.parseBodyOfContoller(this, LoginRequestDTO);
      var passwordHash: string;

      try {
        
        const member = await this._memberRepository.getMemberByEmail(loginRequest.email);
        if (!member)
          throw ""

          if (!bcrypt.compareSync(loginRequest.password, member.person.passwordHash))
          throw new Exception.WrongPassword;
  
        const loginResponse = await this._authRepository.generateToken(member.person);
        
        return JSONSerialization.serializeObject(loginResponse);

      } catch (error) {
        throw new Exception.MemberNotFound(loginRequest.email); 
      }

    } catch (error) {
      this.throw(error);
    }

  }

  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

    try {

      const refreshRequest = HTTPUtils.parseBodyOfContoller(this, RefreshCredentialsRequestDTO);
      return await this._authRepository.createNewCredentials(refreshRequest);

    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);
      else
        this.throw(new Errors.BadRequestError(error.message));
    }

  }

  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

    try {

      const resetCodeRequest = HTTPUtils.parseBodyOfContoller(this, MemberPasswordResetCodeRequestDTO);

      const person = await this._personRepository
        .getPersonByEmail(resetCodeRequest.email);

      if (person == undefined) {
        this.throw(new Exception.MemberNotFound(resetCodeRequest.email!));
        return;
      }
      
      const resetCode = await this._personRepository.createPasswordResetCode(person);
      const resetCodeDTO = MemberPasswordResetCodeDTO.create(resetCode.id!);

      // TODO: Return an empty "accepted" response, and call the email service
      return JSONSerialization.serializeObject(resetCodeDTO);

    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

    try {

      const resetPasswordRequest = HTTPUtils.parseBodyOfContoller(this, PersonPasswordResetRequestDTO);
      const person = await this._personRepository.resetPassword(code, resetPasswordRequest);

      return new Return.RequestAccepted(`/api/v1/member/${person.id}`);

    } catch (error) {
      if (error instanceof Error) 
        this.throw(new Errors.BadRequestError((error as Error).message));
      else if (error instanceof HttpError)
        this.throw(error);
    }

  }

}