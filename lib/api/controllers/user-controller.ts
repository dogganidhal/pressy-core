import { Path, GET, PathParam, POST, ContextRequest, BodyOptions } from "typescript-rest";
import UserRepository from "../repositories";
import { Request } from "express";
import { MemberRegistrationDTO } from "../model/dto";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";

@Path('/api/v1/user/')
export class UserController {

  @ContextRequest
  private _activeRequest?: Request;

  private _repository: UserRepository = UserRepository.instance;

  @GET
  public async getAllUsers() {
    return await this._repository.getAllUsers();
  }

  @Path("/:id/")
  @GET
  public async getUserOne(@PathParam("id") id: number) {
    return await this._repository.getUserById(id);
  }

  @POST
  public async createUser() {

    try {
      const jsonObject = JSON.parse(this._activeRequest!.body);
      const convert = new JsonConvert();
      const newMember: MemberRegistrationDTO = convert.deserialize(jsonObject, MemberRegistrationDTO);
      
      console.log(await this._repository.saveUser(newMember));

    } catch (error) {
      // TODO: Return HTTP error
      console.log(error);
    }

  }

}