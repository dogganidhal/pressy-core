import {Path, POST} from "typescript-rest";
import {MemberRepository} from "../../common/repositories/users/member-repository";
import {Authenticate, JSONResponse} from "../annotations";
import {BaseController} from "./base-controller";
import {Database} from "../../common/db";
import {crypto} from "../../common/services/crypto";

@Path("/api/v1/driver/")
export class DriverController extends BaseController {

  private _memberRepository = new MemberRepository(Database.getConnection());

  @JSONResponse
  @POST
  public async createDriver() {

    

  }

}