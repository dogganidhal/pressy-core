import { Path, POST } from "typescript-rest";
import { MemberRepository } from "../../common/repositories/member-repository";
import { AuthPrivilege } from "../../common/repositories/auth-repository";
import { getConnection } from "typeorm";
import {Authenticate} from "../annotations/authenticate";
import {BaseController} from "./base-controller";

@Path("/api/v1/driver/")
export class DriverController extends BaseController {

  private _memberRepository = new MemberRepository(getConnection());

  @Authenticate(AuthPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    

  }

}