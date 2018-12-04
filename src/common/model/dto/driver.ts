import {Required} from "../../annotations";

export module driver {

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

	export interface IAssignOrderDriverRequest {
		driverId: number;
		orderId: number;
	}

	export class AssignOrderDriverRequest {

		@Required()
		public driverId: number;

		@Required()
		public orderId: number;

		public static create(request: IAssignOrderDriverRequest): AssignOrderDriverRequest {
			let createDriverAvailabilityRequest = new AssignOrderDriverRequest;
			
			createDriverAvailabilityRequest.driverId = request.driverId;
			createDriverAvailabilityRequest.orderId = request.orderId;
			
			return createDriverAvailabilityRequest;
		}

	}

}