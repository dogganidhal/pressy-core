import { SlotRepository } from "../../lib/api/repositories/slot-repository";
import { SlotType } from "../../lib/api/model/entity/order/slot";


describe("Slot repository operation related tests", () => {

  const slotRepository = new SlotRepository;

  test("Retrieves single-type slots from database", async (done) => {

    const slots = await slotRepository.searchSlots([SlotType.EXPRESS], new Date("2008"), new Date("3000"));
    console.log(slots);
    done();

  });
  
})
