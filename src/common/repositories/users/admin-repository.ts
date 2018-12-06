import { BaseRepository } from "../base-repository";
import { Admin } from "../../../common/model/entity/users/admin/admin";
import { Repository } from "typeorm";


export class AdminRepository extends BaseRepository {

  private _adminRepository: Repository<Admin> = this.connection.getRepository(Admin);

  public async getAllAdmins(): Promise<Admin[]> {
    return await this._adminRepository.find({relations: ["person"]});
  }

}