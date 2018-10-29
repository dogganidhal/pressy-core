import { Path, POST } from "typescript-rest";
import { Controller, Authenticated } from "../../common/controller";
import { MemberRepository } from "../../common/repositories/member-repository";
import { AuthPrivilege } from "../../common/repositories/auth-repository";
import { getConnection } from "typeorm";

@Path("/api/v1/driver/")
export class DriverController extends Controller {

  private _memberRepository = new MemberRepository(getConnection());

  @Authenticated(AuthPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    

  }

}