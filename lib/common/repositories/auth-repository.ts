import "crypto";
import { Member, MemberGroup } from "../model/entity/users";
import { AccessPrivilege } from "../model";
import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { Exception } from "../errors";
import { MemberRepository } from "./member-repository";
import { RefreshCredentialsRequestDTO, LoginResponseDTO } from "../model/dto";

interface IAuthPayload {
  id: number;
  privilege: number
}

export class AuthRepository {

  public static instance: AuthRepository = new AuthRepository();

  private _publicKey: string = process.env.AUTH_PUKEY!;
  private _privateKey: string = process.env.AUTH_PRKEY!;

  public async generateToken(member: Member): Promise<LoginResponseDTO> {

    const payload: IAuthPayload = {
      id: member.id,
      privilege: member.group == MemberGroup.SUPERUSER ? AccessPrivilege.SUPERUSER : AccessPrivilege.BASIC
    };

    const signOptions: SignOptions = {
      audience: member.id.toString(),
      issuer: "pressy",
      algorithm: "RS256"
    };

    const token = sign(payload, this._privateKey, {...signOptions, expiresIn: "1h", subject: "access"});
    const refreshToken = sign(payload, this._privateKey, {...signOptions, subject: "refresh"});

    return LoginResponseDTO.create(token, refreshToken);

  }

  public async decodeToken(token: string, minimumPrivilege: AccessPrivilege): Promise<Member> {

    var payload: IAuthPayload;

    try {

      const decodedPayload = verify(token, this._publicKey);
      payload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;

    } catch (error) {
      throw new Exception.InvalidAccessToken(error.message);
    }

    if (!payload)
      throw new Exception.InvalidAccessToken;

    if (payload.privilege < minimumPrivilege) 
      throw new Exception.UnauthorizedRequest;

    const member = await MemberRepository.instance.getMemberById(payload.id);

    if (!member)
      throw new Exception.AccessTokenNotFound;
      
    if (payload.privilege == AccessPrivilege.SUPERUSER && member.group != MemberGroup.SUPERUSER)
      throw new Exception.UnauthorizedRequest;

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

      return LoginResponseDTO.create(sign({...accessToken, expiresIn: "1h"}, this._privateKey, signOptions), request.refreshToken);
    } catch (error) {
      throw new Exception.InvalidAccessToken
    }

  }

}