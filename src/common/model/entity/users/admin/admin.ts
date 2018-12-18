import {User} from "../index";
import {Person, PersonStatus} from "../person";
import {Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";


@Entity()
export class Admin extends User {

}