import { Article } from "../../entity/order";


export class ArticleDto {

	public id: number;
	public name: string;
	public laundryPrice: number;
	public photoUrl: string;
	public comment?: string;

	public constructor(article: Article) {
		this.id = article.id;
		this.name = article.name;
		this.laundryPrice = article.laundryPrice;
		this.photoUrl = article.photoUrl;
		this.comment = article.comment;
	}

}