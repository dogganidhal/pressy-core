import { BaseRepository } from "../base-repository";
import { Admin } from "../../model/entity/users/admin/admin";
import { Repository } from "typeorm";
import {Person} from "../../model/entity/users/person";
import {exception} from "../../errors";
import { IAdminRepository } from ".";
import { CreatePersonRequestDto } from "../../model/dto";


export class AdminRepositoryImpl extends BaseRepository implements IAdminRepository {

  private _adminRepository: Repository<Admin> = this.connection.getRepository(Admin);
  private _personRepository: Repository<Person> = this.connection.getRepository(Person);

  public async getAllAdmins(): Promise<Admin[]> {
    return await this._adminRepository.find({relations: ["person"]});
  }

  public async getAdminById(id:number): Promise<Admin | undefined> {
    return this._adminRepository.findOne(id, {relations:["person"]});
  }

  public async getAdminByEmail(email: string): Promise<Admin | undefined> {
    let person = await this._personRepository.findOne({email: email.toLowerCase()});
    if (!person)
      throw new exception.AccountNotFoundException(email);
    return this._adminRepository.findOne({person: person}, {relations:["person"]});
  }

  public async createAdmin(request: CreatePersonRequestDto): Promise<Admin> {
    
    let admin = Admin.create(request);
    
    await this._personRepository.insert(admin.person);
    await this._adminRepository.insert(admin);

    return admin;

  }

}