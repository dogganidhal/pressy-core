import {Person} from "./person";

export interface IUser {
	id: number;
	person: Person;
	isActive(): boolean;
}