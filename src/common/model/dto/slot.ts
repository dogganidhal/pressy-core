import {SlotType, Slot} from '../entity/slot';
import {Required} from "../../annotations";

export class SlotDto {

	public id: number;
	public type?: string;
	public startDate: Date;

	constructor(slot: Slot) {
		this.id = slot.id;
		this.type = SlotType.toString(slot.type);
		this.startDate = slot.startDate;
	}

}

export interface ICreateSlotRequest {
	startDate: Date;
	type: SlotType;
	availableDrivers: number;
}

export class DeleteSlotRequest {

	@Required()
	public id: number;
	
}

export class EditSlotRequestDto {

	@Required()
	public id: number;

	public startDate?: Date;

	public type?: SlotType;

	public availableDrivers?: number;

}

export class CreateSlotRequestDto {

	@Required()
	public startDate: Date;

	@Required()
	public type: SlotType;

	@Required()
	public availableDrivers: number;

	constructor();
	constructor(request: ICreateSlotRequest);
	constructor(request?: ICreateSlotRequest) {
		if (request) {
			this.startDate = request.startDate;
			this.type = request.type;
			this.availableDrivers = request.availableDrivers;
		}
	}

}