import { SlotType, Slot } from '../entity/order/slot';
import { DateUtils } from '../../utils';

export interface ISlot {
	id: number;
	type: SlotType;
	startDate: Date;
}

export class SlotDTO {

  public id: number;
  public type: SlotType;
  public startDate: Date;

  constructor(slot: ISlot) {
    this.id = slot.id;
	  this.type = slot.type;
	  this.startDate = slot.startDate;
  }

}