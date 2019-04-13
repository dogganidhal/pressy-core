import { BaseController } from "../../common/controller/base-controller";
import { Path, Accept, GET, POST } from "typescript-rest";
import { Produces, Tags, Security } from "typescript-rest-swagger";
import { JSONEndpoint, Authenticate } from "../../common/annotations";
import { SigningCategory } from "../../services/crypto";
import { JSONBody } from "../../common/annotations/json-body";


@Produces("application/json")
@Tags("Orders")
@Accept("application/json")
@Path('/order')
export class OrderController extends BaseController {
  
  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.LAUNDRER)
  @POST
  public createInvoice() {
    return {
      message: "Hello World"
    };
  }

}