import {GET, Path, POST, Accept, DELETE, PathParam} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { Security, Produces, Tags, Response } from "typescript-rest-swagger";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member";
import { RepositoryFactory } from "../../common/repository/factory";
import { IPaymentAccountRepository } from "../../common/repository/payment-account-repository";
import { PaymentAccountDto } from "../../common/model/dto/payment/payment-account";
import { CreatePaymentAccountDto } from "../../common/model/dto/payment/create-payment-account";
import { IPaymentManager } from "../../common/manager/payment";
import { ManagerFactory } from "../../common/manager";


@Produces("application/json")
@Tags("Payments")
@Accept("application/json")
@Path('/payment')
export class PaymentController extends BaseController {

  private _paymentAccountRepository: IPaymentAccountRepository = RepositoryFactory.instance.paymentAccountRepository;
  private _paymentManager: IPaymentManager = ManagerFactory.instance.paymentManager;

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getMemberPaymentAccounts(): Promise<PaymentAccountDto[]> {
    let paymentAccounts = await this._paymentAccountRepository.getMemberPaymentAccounts(<Member>this.pendingUser);
    return paymentAccounts.map(pa => new PaymentAccountDto(pa));
  }

  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createPaymentAccount(@JSONBody(CreatePaymentAccountDto) request: CreatePaymentAccountDto): Promise<PaymentAccountDto> {
    let paymentAccount = await this._paymentManager.addPaymentAccountForMember(<Member>this.pendingUser, request);
    return new PaymentAccountDto(paymentAccount);
  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @Path("/:paymentAccountId")
  @DELETE
  public async deletePaymentAccount(@PathParam("paymentAccountId") paymentAccountId: string) {
    await this._paymentAccountRepository.deletePaymentAccount(paymentAccountId, <Member>this.pendingUser);
  }

}