import {User} from "../index";
import {Entity} from "typeorm";
import { CreatePersonRequestDto } from "../../../dto";
import { Person } from "../person";


@Entity()
export class Admin extends User {

  public static create(request: CreatePersonRequestDto): Admin {

    let admin = new Admin();
    admin.person = Person.create(request);
    return admin;

 }
}