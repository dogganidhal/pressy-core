import { Slot } from "../../model/entity/slot";
import { CreateSlotRequestDto, EditSlotRequestDto, DeleteSlotRequest } from "../../model/dto";


export interface ISlotRepository {

  getSlotById(id: number): Promise<Slot | undefined>;
  createSlot(createSlotRequest: CreateSlotRequestDto): Promise<Slot>;
  getAvailableSlots(type?: string): Promise<Slot[]>;
  editSlot(editSlotRequest: EditSlotRequestDto): Promise<Slot>;
  deleteSlot(deleteSlotRequest: DeleteSlotRequest): Promise<void>;

}