import { Entity, Column, PrimaryColumn } from "typeorm";

export enum AccessPrivilege {
  BASIC = 1,
  SUPERUSER = 2
}


@Entity()
export class AccessToken {

  @PrimaryColumn()
  public token: string = "";

  @Column()
  public refreshToken: string = "";

  public static create(token: string, refreshToken: string): AccessToken {
    const accessToken = new AccessToken();
    accessToken.token = token;
    accessToken.refreshToken = refreshToken;
    return accessToken;
  }

}