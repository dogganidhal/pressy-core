import { Admin } from "../../model/entity/users/admin/admin";


export interface IAdminRepository {

  getAllAdmins(): Promise<Admin[]>;
  getAdminById(id:number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;

}