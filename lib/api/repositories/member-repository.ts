import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { Member, MemberPasswordResetCode } from "../model/entity";
import { AccessToken } from "../model/entity/auth";
import { connectToDatabase } from "../db";
import { MemberRegistrationDTO, MemberPasswordResetRequestDTO } from "../model/dto";
import { Exception } from "../errors";
import { DateUtils } from "../utils";

const TokenGenerator = require("uuid-token-generator");


export class MemberRepository {

  public static instance: MemberRepository = new MemberRepository();

  private _memberRepositoryPromise: Promise<Repository<Member>>;
  private _resetCodeRepositoryPromise: Promise<Repository<MemberPasswordResetCode>>;
  public _accessTokenRepositoryPromise: Promise<Repository<AccessToken>>;

  constructor() {
    this._memberRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(Member));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._resetCodeRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(MemberPasswordResetCode));
      })
      .catch(error => {
        reject(error);
      });
    });
    this._accessTokenRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(AccessToken));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async getAllMembers(): Promise<Member[]> {
    return (await this._memberRepositoryPromise).find();
  }

  public async getMemberById(id: number): Promise<Member | undefined> {
    return (await this._memberRepositoryPromise).findOne(id);
  }

  public async getMemberByEmail(email: string): Promise<Member | undefined> {
    return (await this._memberRepositoryPromise).findOne({email: email});
  }

  public async createMember(memberDTO: MemberRegistrationDTO): Promise<Member> {
    const newMember = Member.create(memberDTO);
    return (await this._memberRepositoryPromise).save(newMember);
  }

  public async resetPassword(code: string, resetPasswordRequest: MemberPasswordResetRequestDTO): Promise<Member> {
    const passwordResetRequestCode = await (await (await this._resetCodeRepositoryPromise)).findOne(code, {relations: ["member"]});

    if (passwordResetRequestCode == undefined)
      throw new Exception.PasswordResetCodeNotFound(code);
    if (passwordResetRequestCode!.expiryDate! < DateUtils.now())
      throw new Exception.PasswordResetCodeExpired(code);

    const member = passwordResetRequestCode!.member!;

    if (!bcrypt.compareSync(resetPasswordRequest.oldPassword, member.passwordHash!))
      throw new Exception.WrongPassword();

    member.passwordHash = bcrypt.hashSync(resetPasswordRequest.newPassword, 10);
    return (await this._memberRepositoryPromise).save(member);
  }

  public async createPasswordResetCode(member: Member): Promise<MemberPasswordResetCode> {
    const code = MemberPasswordResetCode.create(member);
    return (await this._resetCodeRepositoryPromise).save(code);
  }

  public async deletePasswordResetCode(passwordResetCode: MemberPasswordResetCode): Promise<void> {
    (await this._resetCodeRepositoryPromise).delete(passwordResetCode);
  }

}