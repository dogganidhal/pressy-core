import {BaseController} from "../../common/controller/base-controller";
import {Accept, Path, POST, GET, PathParam} from "typescript-rest";
import {Produces, Security, Tags} from "typescript-rest-swagger";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {JSONBody} from "../../common/annotations/json-body";
import {TerminateOrderRequest} from "../../common/model/dto/order/terminate-order-request";
import {IOrderRepository} from "../../common/repository/order-repository";
import {RepositoryFactory} from "../../common/repository/factory";
import {exception} from "../../common/errors";
import {OrderType} from "../../common/model/entity/order";
import {IInvoiceRepository} from "../../common/repository/invoice-repository";
import {OrderItem} from "../../common/model/entity/order/order-item";
import {IArticleRepository} from "../../common/repository/article-repository";
import {InvoiceDto} from "../../common/model/dto/invoice/invoice";
import { OrderDto } from "../../common/model/dto";
import { Laundrer } from "../../common/model/entity/users/laundry/laundrer";
import { IOrderManager } from "../../common/manager/order";
import { ManagerFactory } from "../../common/manager";


@Produces("application/json")
@Tags("Orders")
@Accept("application/json")
@Path('/order')
export class OrderController extends BaseController {

  private _orderManager: IOrderManager = ManagerFactory.instance.orderManager;
  private _orderRepository: IOrderRepository = RepositoryFactory.instance.orderRepository;
  private _invoiceRepository: IInvoiceRepository = RepositoryFactory.instance.invoiceRepository;
  private _articleRepository: IArticleRepository = RepositoryFactory.instance.articleRepository;
  
  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.LAUNDRER)
  @Path("/terminate")
  @POST
  public async createInvoice(@JSONBody(TerminateOrderRequest) request: TerminateOrderRequest): Promise<InvoiceDto> {
    
    let invoice = await this._orderManager.terminateOrder(request);
    return InvoiceDto.create(invoice);

  }

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.LAUNDRER)
  @Path("/today-orders")
  @GET
  public async getTodayOrders(): Promise<OrderDto[]> {

    let laundrer = <Laundrer>this.pendingUser;
    let orders = await this._orderRepository.getTodayOrdersByLaundryPartner(laundrer.laundryPartner);
    return orders.map(order => new OrderDto(order));

  }

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.LAUNDRER)
  @Path(":id")
  @GET
  public async getOrderInfo(@PathParam("id") id: number): Promise<OrderDto> {

    let order = await this._orderRepository.getOrderById(id);
    if (!order)
      throw new exception.OrderNotFoundException(id);

    return new OrderDto(order);

  }

}