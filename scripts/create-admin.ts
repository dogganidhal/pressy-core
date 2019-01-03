import { Database } from "../src/common/db";
import { RepositoryFactory } from "../src/common/repositories/factory";
import { CreatePersonRequestDto, PersonInfo } from "../src/common/model/dto";
import { question, questionEMail as questionEmail, questionNewPassword } from "readline-sync";
import parse from "yargs-parser";
import { Admin } from "../src/common/model/entity/users/admin/admin";

interface ICreateAdminArgs extends parse.Arguments {
  config?: string;
}

let vargs = <ICreateAdminArgs>parse(process.argv.slice(2));

let firstName = question("First name: ");
let lastName = question("Last name: ");
let email = questionEmail("Email: ");
let phone = question("Phone: ");
let password = questionNewPassword("Password: ", {
  hideEchoBack: true,
});

createAdmin(<CreatePersonRequestDto>{
  firstName: firstName,
  lastName: lastName,
  email: email,
  phone: phone,
  password
})
.then(admin => {
  console.log("successfully created admin");
  console.log(JSON.stringify(admin, null, 2));
})
.catch(error => console.error(error));

async function createAdmin(request: CreatePersonRequestDto): Promise<Admin> {

  let connection = await Database.createConnection(vargs.config);
  let repositoryFactory = new RepositoryFactory(connection);
  let adminRepository = repositoryFactory.createAdminRepository();

  let admin = await adminRepository.createAdmin(request);

  connection.close();

  return admin;
  
}