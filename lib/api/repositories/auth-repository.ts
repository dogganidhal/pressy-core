import "fs";
import "crypto";
import { readFileSync } from "fs";
import { Member, AccessToken, AccessPrivilege } from "../model/entity";
import { sign, decode } from "jsonwebtoken";
import { Repository } from "typeorm";
import { connectToDatabase } from "../db";
import { Exception } from "../errors";
import { MemberRepository } from "./member-repository";

interface IAuthPayload {
  id: number;
  secret: string,
  privilege: number
}

export class AuthRepository {

  public static instance: AuthRepository = new AuthRepository();

  private _signature: string = readFileSync("cer.key").toString();
  private _accessTokenRepositoryPromise: Promise<Repository<AccessToken>>;

  constructor() {
    this._accessTokenRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(AccessToken));
      })
      .catch(error => {
        reject(error);
      })
    });
  }

  public async generateToken(member: Member, privilege: AccessPrivilege = AccessPrivilege.BASIC): Promise<AccessToken> {

    const payload: IAuthPayload = {
      id: member.id,
      secret: member.secret,
      privilege: privilege
    };

    const token = sign(payload, this._signature, {expiresIn: 3600});
    const refreshToken = sign({...payload, token}, this._signature);
    const accessToken = AccessToken.create(token, refreshToken);

    (await this._accessTokenRepositoryPromise).save(accessToken);

    return accessToken;

  }

  public async decodeToken(token: string, minimumPrivilege: AccessPrivilege): Promise<Member> {

    var payload: IAuthPayload;

    try {
      const decodedPayload = decode(token);
      payload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;
    } catch (error) {
      throw new Exception.InvalidAccessToken;
    }

    if (payload.privilege < minimumPrivilege) 
      throw new Exception.UnauthorizedRequest;

    const member = await MemberRepository.instance.getMemberById(payload.id);

    if (!member)
      throw new Exception.AccessTokenNotFound;

    return member;

  }

}