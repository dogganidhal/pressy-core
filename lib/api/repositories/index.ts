import { ConnectionManager, Repository, Connection } from "typeorm";
import database from "../../../database";
import { Member } from "../model/entity";
import { connectToDatabase } from "../db";
import { MemberRegistrationDTO } from "../model/dto";


export default class UserRepository {

  public static instance: UserRepository = new UserRepository();

  private _databaseRepositoryPromise: Promise<Repository<Member>>;

  constructor() {
    this._databaseRepositoryPromise = new Promise((resolve, reject) => {
      connectToDatabase()
      .then(connection => {
        resolve(connection.getRepository(Member))
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async getAllUsers(): Promise<Member[]> {
    return (await this._databaseRepositoryPromise).find();
  }

  public async getUserById(id: number): Promise<Member | undefined> {
    return (await this._databaseRepositoryPromise).findOne(id);
  }

  public async saveUser(memberDTO: MemberRegistrationDTO): Promise<Member> {
    const newMember = Member.create(memberDTO);
    return (await this._databaseRepositoryPromise).save(newMember);
  }

}