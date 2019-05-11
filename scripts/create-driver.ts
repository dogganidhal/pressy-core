import { Database } from "../src/common/db";
import { RepositoryFactory } from "../src/common/repository/factory";
import { CreatePersonRequestDto } from "../src/common/model/dto";
import { question, questionEMail as questionEmail, questionNewPassword } from "readline-sync";
import parse from "yargs-parser";
import { Driver } from "../src/common/model/entity/users/driver/driver";

interface ICreateDriverArgs extends parse.Arguments {
  config?: string;
}

let vargs = <ICreateDriverArgs>parse(process.argv.slice(2));

let firstName = question("First name: ");
let lastName = question("Last name: ");
let email = questionEmail("Email: ");
let phone = question("Phone: ");
let password = questionNewPassword("Password: ", {
  hideEchoBack: true,
});

createDriver(<CreatePersonRequestDto>{
  firstName: firstName,
  lastName: lastName,
  email: email,
  phone: phone,
  password
})
  .then(driver => {
    console.log("successfully created driver");
    console.log(JSON.stringify(driver, null, 2));
  })
  .catch(error => console.error(error));

async function createDriver(request: CreatePersonRequestDto): Promise<Driver> {

  let connection = await Database.createConnection(vargs.config);
  let repositoryFactory = new RepositoryFactory(connection);
  let driverRepository = repositoryFactory.driverRepository;

  let driver = await driverRepository.createDriver(request);

  connection.close();

  return driver;

}