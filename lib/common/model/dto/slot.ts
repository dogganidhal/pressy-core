import { SlotType, Slot } from './../entity/order/slot';
import { JsonObject, JsonProperty } from "json2typescript";
import { JSONSerialization } from '../../utils/json-serialization';
import { DateUtils } from '../../utils';


@JsonObject
export class SlotDTO {

  @JsonProperty("id", Number)
  public id: number = -1;

  @JsonProperty("type", Number)
  public type: SlotType = SlotType.LIGHT;

  @JsonProperty("start_date", JSONSerialization.UTCDateConvert)
  public startDate: Date = DateUtils.now();

  public static create(slot: Slot): SlotDTO {
    const slotDTO = new SlotDTO;

    slotDTO.id = slot.id;
    slotDTO.startDate = slot.startDate;
    slotDTO.type = slot.type;

    return slotDTO;
  }

}