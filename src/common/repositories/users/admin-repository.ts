import { BaseRepository } from "../base-repository";
import { Admin } from "../../../common/model/entity/users/admin/admin";
import { Repository } from "typeorm";
import {Person} from "../../model/entity/users/person";
import {exception} from "../../errors";


export class AdminRepository extends BaseRepository {

  private _adminRepository: Repository<Admin> = this.connection.getRepository(Admin);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);

  public async getAllAdmins(): Promise<Admin[]> {
    return await this._adminRepository.find({relations: ["person"]});
  }

  public async getAdminById(id:number): Promise<Admin | undefined> {
    return this._adminRepository.findOne(id, {relations:["person"]});
  }

  public async getAdminByEmail(email: string): Promise<Admin | undefined> {
    let person = await this._personRepository.findOne({email: email});
    if (!person)
      throw new exception.AccountNotFoundException(email);
    return this._adminRepository.findOne({person: person}, {relations:["person"]});
  }

}