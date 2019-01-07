import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

interface IArticle {
  name: string;
  laundryPrice: number;
  photoUrl: string; 
  comment?: string;
}

@Entity()
export class Article {

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

  public constructor();
  public constructor(article: IArticle);
  public constructor(article?: IArticle) {
    if (article) {
      this.laundryPrice = article.laundryPrice;
      this.name = article.name;
      this.comment = article.comment;
    }
  }


}