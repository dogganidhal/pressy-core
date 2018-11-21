import {Connection} from 'typeorm';
import {SlotRepository} from "../../src/common/repositories/slot-repository";
import {SlotType} from "../../src/common/model/entity/slot";
import {Database} from "../../src/common/db";


describe("Slot repository operation related tests", () => {

  let slotRepository: SlotRepository;
  let connection: Connection;

  beforeAll(async done => {
    connection = await Database.createConnection();
    slotRepository = new SlotRepository(connection);
    done();
  });

  it("Retrieves single-type slots from database", async (done) => {

    const slots = await slotRepository.searchSlots({
      from: new Date("2008"),
      to: new Date(3000),
      types: [SlotType.LIGHT]
    });
    console.log(slots);
    done();

  }, 60000);

  afterAll(async done => {
    await connection.close();
    done();
  });
  
});
