import { SlotType } from '../entity/slot';
import {Required} from "../../annotations";

export namespace slot {

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

	export interface ICreateSlotRequest {
		startDate: Date;
		type: SlotType;
	}

	export class CreateSlotRequest {

		@Required()
		public startDate: Date;

		@Required()
		public type: SlotType;

		constructor(request: ICreateSlotRequest) {
			this.startDate = request.startDate;
			this.type = request.type;
		}

	}

	export interface ISearchSlotRequest {
		from: Date;
		to: Date;
		types: SlotType[];
	}

	export class SearchSlotRequest {

		@Required()
		public from: Date;

		@Required()
		public to: Date;

		@Required()
		public types: SlotType[];

		constructor(request: ISearchSlotRequest) {
			this.from = request.from;
			this.to = request.to;
			this.types = request.types;
		}

	}

}