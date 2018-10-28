import { Path, POST } from "typescript-rest";
import { MemberRepository, AuthPrivilege } from "../../common/repositories";
import { Controller, Authenticated } from "../../common/controller";

@Path("/api/v1/driver/")
export class DriverController extends Controller {

  private _memberRepository = new MemberRepository;

  @Authenticated(AuthPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    

  }

}