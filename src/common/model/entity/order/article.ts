import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

interface IArticle {
  name: string;
  laundryPrice: number;
  photoUrl: string; 
  comment?: string;
  stripeSkuId?: string;
}

@Entity()
export class Article {

  public static WEIGHTED_ARTICLE_PRICE = 4.99;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public name: string;

  @Column({nullable: false, type: "float"})
  public laundryPrice: number;

  @Column({nullable: false})
  public photoUrl: string;

  @Column({nullable: true})
  public comment?: string;

  @Column({ nullable: true, unique: true })
  public stripeSkuId?: string;

  public constructor();
  public constructor(article: IArticle);
  public constructor(article?: IArticle) {
    if (article) {
      this.laundryPrice = article.laundryPrice;
      this.name = article.name;
      this.photoUrl = article.photoUrl;
      this.comment = article.comment;
      this.stripeSkuId = article.stripeSkuId;
    }
  }


}