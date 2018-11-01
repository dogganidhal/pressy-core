import { Person } from '../model/entity/users/person';
import "crypto";
import { Member } from "../model/entity/users/member";
import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { Exception } from "../errors";
import { MemberRepository } from "./member-repository";
import { RefreshCredentialsRequestDTO, LoginResponseDTO } from "../model/dto/member";
import { getConfig } from "../../config";
import { ARepository } from '.';

export enum AuthPrivilege {
  BASIC, SUPERUSER
}

interface IAuthPayload {
  id: number;
  privilege: number
}

export class AuthRepository extends ARepository {

  private _publicKey: string = getConfig().authenticationPublicKey;
  private _privateKey: string = getConfig().authenticationPrivateKey;

  public async generateToken(person: Person, privilege: AuthPrivilege = AuthPrivilege.SUPERUSER): Promise<LoginResponseDTO> {

    const payload: IAuthPayload = {
      id: person.id,
      privilege: AuthPrivilege.BASIC
    };

    const signOptions: SignOptions = {
      audience: person.id.toString(),
      issuer: "pressy",
      algorithm: "RS256"
    };

    const token = sign(payload, this._privateKey, {...signOptions, expiresIn: "1h", subject: "access"});
    const refreshToken = sign(payload, this._privateKey, {...signOptions, subject: "refresh"});

    return new LoginResponseDTO({accessToken: token, refreshToken: refreshToken});

  }

  public async decodeToken(token: string, minimumPrivilege: AuthPrivilege): Promise<Member> {

    const memberRepository = new MemberRepository(this.connection);
    let payload: IAuthPayload;

    try {

      const decodedPayload = verify(token, this._publicKey);
      payload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;

    } catch (error) {
      throw new Exception.InvalidAccessTokenException(error.message);
    }

    if (!payload)
      throw new Exception.InvalidAccessTokenException;

    if (payload.privilege < minimumPrivilege) 
      throw new Exception.UnauthorizedRequestException;

    const member = await memberRepository.getMemberById(payload.id);

    if (!member)
      throw new Exception.AccessTokenNotFoundException;

    return member;

  }

  public async createNewCredentials(request: RefreshCredentialsRequestDTO): Promise<LoginResponseDTO> {

    try {
      const verifyOptions: VerifyOptions = {
        issuer: "pressy",
        algorithms: ["RS256"],
        subject: "refresh"
      };
      const decodedPayload = verify(request.refreshToken, this._publicKey, verifyOptions);
      const payload: IAuthPayload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;

      const signOptions: SignOptions = {
        algorithm: "RS256",
        expiresIn: "1h"
      };

      const accessToken: IAuthPayload = {
        id: payload.id,
        privilege: payload.privilege
      };

      return new LoginResponseDTO({
        accessToken: sign({...accessToken, expiresIn: "1h"}, this._privateKey, signOptions),
        refreshToken: request.refreshToken
      });
    } catch (error) {
      throw new Exception.InvalidAccessTokenException
    }

  }

}