import { Path, POST } from "typescript-rest";
import { MemberRepository } from "../../common/repositories";
import { Controller, Authenticated } from "../../common/controller";
import { AccessPrivilege } from "../../common/model";

@Path("/api/v1/driver/")
export class DriverController extends Controller {

  private _memberRepository = MemberRepository.instance;

  @Authenticated(AccessPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    

  }

}