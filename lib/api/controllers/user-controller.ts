import { Path, GET, PathParam } from "typescript-rest";
import { connectToDatabase } from "../db";
import { Member } from "../entity";

@Path('/api/v1/user/')
export class UserController {

  @GET
  public async getAllUsers() {

    const connection = await connectToDatabase();
    const repository = connection.getRepository(Member);
    const users = await repository.find();
    
    return users;
    
  }

  @Path("/:id/")
  @GET
  public async getUserOne(@PathParam("id") id: number) {

    const connection = await connectToDatabase();
    const repository = connection.getRepository(Member);
    const user = await repository.findOne(id);
    
    return user;

  }

}