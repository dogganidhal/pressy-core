import { Article } from "../../model/entity/order";
import { CreateArticleRequestDto } from "../../model/dto/order/create-article";


export interface IArticleRepository {

  getArticles(): Promise<Article[]>;
  createArticle(request: CreateArticleRequestDto): Promise<void>;

}