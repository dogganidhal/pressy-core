import { SlotType } from '../entity/slot';

export module slot {

	export interface ISlot {
		id: number;
		type: SlotType;
		startDate: Date;
	}

	export class Slot {

		public id: number;
		public type: SlotType;
		public startDate: Date;

		constructor(slot: ISlot) {
			this.id = slot.id;
			this.type = slot.type;
			this.startDate = slot.startDate;
		}

	}

}