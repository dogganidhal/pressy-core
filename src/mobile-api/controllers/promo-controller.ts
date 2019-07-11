import { BaseController } from "../../common/controller/base-controller";
import { Path, POST, GET } from "typescript-rest";
import { Produces, Tags } from "typescript-rest-swagger";
import { JSONEndpoint } from "../../common/annotations";
import { JSONBody } from "../../common/annotations/json-body";
import { RepositoryFactory } from "../../common/repository/factory";
import { ICouponRepository } from "../../common/repository";
import { VerifyCouponRequestDto, CreateCouponRequestDto } from "../../common/model/dto/promo-code";
import { Coupon } from "common/model/entity/order/coupon";

@Produces("application/json")
@Tags("Coupon")
@Path("/coupon_codes")
export class promocode extends BaseController {
  private _couponrepo: ICouponRepository =
    RepositoryFactory.instance.CouponRepository;
  @JSONEndpoint
  @GET
  @Path("/getPromoCodes")
  public async getPromo(): Promise<string> {
    return "Route for promocode Created..";
  }

  @JSONEndpoint
  @POST
  @Path("/redeem")
  public async verifyPromoCode(
    @JSONBody(VerifyCouponRequestDto) request: VerifyCouponRequestDto
  ): Promise<string> {
    // if (request.length == undefined) throw new exception.InvalidCopounCode(id);
    console.log(request.id);

    return await this._couponrepo.couponExists(request.id);
  }

  @JSONEndpoint
  @POST
  @Path("/create")
  public async createCouponCode(
    @JSONBody(CreateCouponRequestDto) request: CreateCouponRequestDto
  ): Promise<Coupon> {
    // if (request.length == undefined) throw new exception.InvalidCopounCode(id);
    console.log(`request id: ${request.id}`);

    return await this._couponrepo.createCoupon(
      request.duration,
      request.amount_off,
      request.currency,
      request.name,
      request.duration_in_months,
      request.redeem_by,
      request.id
    );
  }
}
