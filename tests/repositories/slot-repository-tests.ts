import { createConnection } from 'typeorm';
import { Connection } from 'typeorm';
import { SlotRepository } from "../../src/common/repositories/slot-repository";
import { SlotType } from "../../src/common/model/entity/order/slot";


describe("Slot repository operation related tests", () => {

  var slotRepository: SlotRepository;
  var connection: Connection;

  beforeAll(async done => {
    connection = await createConnection();
    slotRepository = new SlotRepository(connection);
    done();
  });

  it("Retrieves single-type slots from database", async (done) => {

    const slots = await slotRepository.searchSlots([SlotType.EXPRESS], new Date("2008"), new Date("3000"));
    console.log(slots);
    done();

  });

  afterAll(async done => {
    await connection.close();
    done();
  });
  
});
