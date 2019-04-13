import { Database } from "../src/common/db";
import { RepositoryFactory } from "../src/common/repositories/factory";
import { CreatePersonRequestDto } from "../src/common/model/dto";
import {question, questionEMail as questionEmail, questionInt, questionNewPassword} from "readline-sync";
import parse from "yargs-parser";
import {Laundrer} from "../src/common/model/entity/users/laundry/laundrer";

interface ICreateLaundrerArgs extends parse.Arguments {
	config?: string;
}

let vargs = <ICreateLaundrerArgs>parse(process.argv.slice(2));

let firstName = question("First name: ");
let lastName = question("Last name: ");
let email = questionEmail("Email: ");
let phone = question("Phone: ");
let password = questionNewPassword("Password: ", {
	hideEchoBack: true,
});
let partnerId: number = questionInt("Partner Id: ");

createLaundrer(<CreatePersonRequestDto>{
	firstName: firstName,
	lastName: lastName,
	email: email,
	phone: phone,
	password
}, partnerId)
	.then(admin => {
		console.log("successfully created laundrer");
		console.log(JSON.stringify(admin, null, 2));
	})
	.catch(error => console.error(error));

async function createLaundrer(request: CreatePersonRequestDto, partnerId: number): Promise<Laundrer> {

	let connection = await Database.createConnection(vargs.config);
	let repositoryFactory = new RepositoryFactory(connection);
	let laundryRepository = repositoryFactory.createLaundryRepository();

	let admin = await laundryRepository.createLaundrer(request, partnerId);

	connection.close();

	return admin;

}