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


@Produces("application/json")
@Tags("Articles")
@Path("/article")
export class ArticleController extends BaseController {

	private _articleRepository: IArticleRepository = RepositoryFactory.instance.createArticleRepository();

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createArticle(@JSONBody(CreateArticleRequestDto) request: CreateArticleRequestDto): Promise<void> {
    await this._articleRepository.createArticle(request);		
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