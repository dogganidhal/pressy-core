import { BaseRepository } from "../base-repository";
import { IArticleRepository } from ".";
import { Article } from "../../model/entity/order";
import { CreateArticleRequestDto } from "../../model/dto/order/create-article";
import { Repository } from "typeorm";


export class ArticleRepositoryImpl extends BaseRepository implements IArticleRepository {

  private _articleRepository: Repository<Article> = this.connection.getRepository(Article);
  
  public async getArticles(): Promise<Article[]> {
    return await this._articleRepository.find();
  }  
  
  public async createArticle(request: CreateArticleRequestDto): Promise<void> {
    
    let article = new Article(request);
    await this._articleRepository.save(article);
    
  }

  public async getArticleById(articleId: number): Promise<Article | undefined> {
	  return this._articleRepository.findOne(articleId);
  }

}