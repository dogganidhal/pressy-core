import {BaseController} from "../../common/controller/base-controller";
import {Accept, Path, POST, GET, PathParam} from "typescript-rest";
import {Produces, Security, Tags} from "typescript-rest-swagger";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {JSONBody} from "../../common/annotations/json-body";
import {TerminateOrderRequest} from "../../common/model/dto/order/terminate-order-request";
import {IOrderRepository} from "../../common/repositories/order-repository";
import {RepositoryFactory} from "../../common/repositories/factory";
import {exception} from "../../common/errors";
import {Article, Order, OrderType} from "../../common/model/entity/order";
import {IInvoiceRepository} from "../../common/repositories/invoice-repository";
import {OrderItem} from "../../common/model/entity/order/order-item";
import {IArticleRepository} from "../../common/repositories/article-repository";
import {InvoiceDto} from "../../common/model/dto/invoice/invoice";
import { OrderDto } from "../../common/model/dto";
import { Laundrer } from "../../common/model/entity/users/laundry/laundrer";


@Produces("application/json")
@Tags("Orders")
@Accept("application/json")
@Path('/order')
export class OrderController extends BaseController {

  private _orderRepository: IOrderRepository = RepositoryFactory.instance.createOrderRepository();
  private _invoiceRepository: IInvoiceRepository = RepositoryFactory.instance.createInvoiceRepository();
  private _articleRepository: IArticleRepository = RepositoryFactory.instance.createArticleRepository();
  
  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.LAUNDRER)
  @Path("/terminate")
  @POST
  public async createInvoice(@JSONBody(TerminateOrderRequest) request: TerminateOrderRequest): Promise<InvoiceDto> {

    let order = await this._orderRepository.getOrderById(request.orderId);

    if (!order)
      throw new exception.OrderNotFoundException(request.orderId);

    let invoices = await this._invoiceRepository.getInvoicesByOrder(order);
    if (invoices.length > 0)
      throw new exception.OrderAlreadyInvoiced(request.orderId);

    let items: OrderItem[] | undefined = undefined;
    let weight: number | undefined = undefined;

    if (order.type == OrderType.PRESSING && !request.orderItems)
      throw new exception.EmptyOrderException;
    else
      items = await Promise.all(request.orderItems.map(async item => {
        let orderItem = new OrderItem();
        let article = await this._articleRepository.getArticleById(item.articleId);
        if (!article)
          throw new exception.ArticleNotFound(item.articleId);
        orderItem.article = article;
        orderItem.quantity = item.quantity;
        orderItem.comment = item.comment;
        return orderItem;
      }));

    if (order.type == OrderType.WEIGHT && !request.weight)
      throw new exception.EmptyOrderException;
    else
      weight = request.weight;

    let invoice = await this._invoiceRepository.createInvoice(order, items, weight);
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