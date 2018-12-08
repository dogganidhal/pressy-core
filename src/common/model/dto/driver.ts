import {Required} from "../../annotations";

export namespace driver {

	export interface IAssignDriverSlotsRequest {
		driverSlotId: number;
	}

	export class AssignDriverSlotsRequest {

		@Required()
		public driverSlotId: number;

		public static create(request: IAssignDriverSlotsRequest): AssignDriverSlotsRequest {
			let createDriverAvailabilityRequest = new AssignDriverSlotsRequest;
			createDriverAvailabilityRequest.driverSlotId = request.driverSlotId;
			return createDriverAvailabilityRequest;
		}

	}

}