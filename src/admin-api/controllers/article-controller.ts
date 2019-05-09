import {BaseController} from "../../common/controller/base-controller";
import {Path, POST, GET} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import { Tags, Produces, Security } from "typescript-rest-swagger";
import { ArticleDto } from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { RepositoryFactory } from "../../common/repositories/factory";
import { CreateArticleRequestDto } from "../../common/model/dto/order/create-article";
import { IArticleRepository } from "../../common/repositories/article-repository";
import Stripe from "stripe";
import { getConfig } from "../../config";
import { Article } from "../../common/model/entity/order";


@Produces("application/json")
@Tags("Articles")
@Path("/article")
export class ArticleController extends BaseController {

	private _articleRepository: IArticleRepository = RepositoryFactory.instance.articleRepository;

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createArticle(@JSONBody(CreateArticleRequestDto) request: CreateArticleRequestDto): Promise<ArticleDto> {
		let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "production"].apiKey;
		let stripe = new Stripe(stripeApiKey);
		let stripeProduct = await stripe.products.create({ name: request.name, type: "good" });
		let stripeSku = await stripe.skus.create({ product: stripeProduct.id, price: request.laundryPrice * 100, currency: "eur", inventory: { type: "infinite" }});
		let article = new Article({
			...request,
			stripeSkuId: stripeSku.id
		});
		article = await this._articleRepository.createArticle(article);
		return new ArticleDto(article);
  }
  
  @Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@GET
	public async getAllArticles(): Promise<ArticleDto[]> {
    var articles = await this._articleRepository.getArticles();
    return articles.map(article => new ArticleDto(article));
  }

}