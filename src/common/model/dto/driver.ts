import {Required} from "../../annotations";

export interface IAssignDriverSlotsRequest {
	driverSlotId: number;
}

export class AssignDriverSlotsRequestDto {

	@Required()
	public driverSlotId: number;

	public static create(request: IAssignDriverSlotsRequest): AssignDriverSlotsRequestDto {
		let createDriverAvailabilityRequest = new AssignDriverSlotsRequestDto;
		createDriverAvailabilityRequest.driverSlotId = request.driverSlotId;
		return createDriverAvailabilityRequest;
	}

}