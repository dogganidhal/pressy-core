import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

interface IArticle {
  name: string;
  laundryPrice: number;
  photoUrl: string; 
  comment?: string;
  stripeSkuId?: string;
}

/* TODO: Handle this properly
  // SQL Query to create the weighted Article
  
  INSERT INTO "article"
  SELECT -1, 'Sac de 5 KG', 3.99, 'https://www.containerstore.com/catalogimages/110918/LaundryBagPolyCottonWhite_x.jpg?width=1200&height=1200&align=center', null, 'sku_F2F6Z31pHm0n70'
  WHERE NOT EXISTS (
    SELECT "id" FROM "article" WHERE "id" = -1
  );
*/

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