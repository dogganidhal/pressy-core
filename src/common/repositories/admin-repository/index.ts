import { Admin } from "../../model/entity/users/admin/admin";
import { CreatePersonRequestDto } from "../../model/dto";


export interface IAdminRepository {

  createAdmin(request: CreatePersonRequestDto): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;
  getAdminById(id:number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;

}