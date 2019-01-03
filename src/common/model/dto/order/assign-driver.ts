import { Required } from "../../../annotations";

export interface IAssignOrderDriverRequest {
	driverId: number;
	orderId: number;
}

export class AssignOrderDriverRequestDto {

	@Required()
	public driverId: number;

	@Required()
	public orderId: number;

	public static create(request: IAssignOrderDriverRequest): AssignOrderDriverRequestDto {
		let createDriverAvailabilityRequest = new AssignOrderDriverRequestDto;
		
		createDriverAvailabilityRequest.driverId = request.driverId;
		createDriverAvailabilityRequest.orderId = request.orderId;
		
		return createDriverAvailabilityRequest;
	}

}