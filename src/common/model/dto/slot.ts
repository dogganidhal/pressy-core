import { SlotType, Slot } from '../entity/order/slot';
import { DateUtils } from '../../utils';


export class SlotDTO {

  public id: number = -1;
  public type: SlotType = SlotType.LIGHT;
  public startDate: Date = DateUtils.now();

  public static create(slot: Slot): SlotDTO {
    const slotDTO = new SlotDTO;

    slotDTO.id = slot.id;
    slotDTO.startDate = slot.startDate;
    slotDTO.type = slot.type;

    return slotDTO;
  }

}