import { Article } from "../../model/entity/order";


export interface IArticleRepository {

  getArticles(): Promise<Article[]>;
  createArticle(request: Article): Promise<Article>;
	getArticleById(articleId: number): Promise<Article | undefined>;

}