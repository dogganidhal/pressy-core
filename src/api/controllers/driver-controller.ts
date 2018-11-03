import { Path, POST } from "typescript-rest";
import { MemberRepository } from "../../common/repositories/member-repository";
import { AuthPrivilege } from "../../common/repositories/auth-repository";
import {Authenticate, JSONResponse} from "../annotations";
import {BaseController} from "./base-controller";
import {Database} from "../../common/db";

@Path("/api/v1/driver/")
export class DriverController extends BaseController {

  private _memberRepository = new MemberRepository(Database.getConnection());

  @JSONResponse
  @Authenticate(AuthPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    

  }

}