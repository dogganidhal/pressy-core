import { Tags, Security, Produces } from "typescript-rest-swagger";
import {GET, Path, POST, QueryParam, Return} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {SigningCategory} from "../../services/crypto";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { OrderMailSender } from "../../common/mail-senders/order-mail-sender";
import { CreateOrderRequestDto, OrderDto, SlotDto, ArticleDto } from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member";
import { IOrderRepository } from "../../common/repositories/order-repository";
import { ISlotRepository } from "../../common/repositories/slot-repository";
import { RepositoryFactory } from "../../common/repositories/factory";
import { IArticleRepository } from "../../common/repositories/article-repository";


@Produces("application/json")
@Tags("Orders")
@Path('/order')
export class OrderController extends BaseController {

  private _orderRepository: IOrderRepository = RepositoryFactory.instance.createOrderRepository();
  private _slotsRepository: ISlotRepository = RepositoryFactory.instance.createSlotRepository();
  private _articleRepository: IArticleRepository = RepositoryFactory.instance.createArticleRepository();

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createOrder(@JSONBody(CreateOrderRequestDto) request: CreateOrderRequestDto) {

		let order = await this._orderRepository.createOrder(<Member>this.pendingUser, request);
		let orderMailSender = new OrderMailSender;

		orderMailSender.sendOrderInformationMailToAdmins(order);

	  return new Return.RequestAccepted("/v1/order");

  }

	@Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getOrders(): Promise<Array<OrderDto>> {

	  let orders = await this._orderRepository.getOrdersForMember(<Member>this.pendingUser);
	  return orders.map(order => new OrderDto(order));

  }

  @JSONEndpoint
  @Path("/slots")
  @GET
  public async getNextAvailableSlots(@QueryParam("type") type?: string): Promise<SlotDto[]> {

    let slots = await this._slotsRepository.getAvailableSlots(type);
	  return slots.map(slot => new SlotDto(slot));

  }

  @JSONEndpoint
  @Path("/articles")
  @GET
  public async getArticles(): Promise<ArticleDto[]> {

    var articles = await this._articleRepository.getArticles();
    return articles.map(article => new ArticleDto(article));
    
  }

}