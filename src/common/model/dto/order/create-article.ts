import { Required } from "../../../annotations";


export class CreateArticleRequestDto {

  @Required()
  public name: string;
  
  @Required()
  public laundryPrice: number;

  @Required()
  public photoUrl: string;
  
	public comment?: string;

}