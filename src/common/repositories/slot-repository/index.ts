import { Slot } from "../../model/entity/slot";
import { CreateSlotRequestDto } from "../../model/dto";


export interface ISlotRepository {

  getSlotById(id: number): Promise<Slot | undefined>;
  createSlot(createSlotRequest: CreateSlotRequestDto): Promise<Slot>;
  getAvailableSlots(type?: string): Promise<Slot[]>;

}