import {Required} from "../../annotations";

export module driver {

	export interface ICreateDriverAvailabilityRequest {
		startDate: Date;
		endDate: Date;
	}

	export class CreateDriverAvailabilityRequest {

		@Required()
		public startDate: Date;

		@Required()
		public endDate: Date;

		public static create(request: ICreateDriverAvailabilityRequest): CreateDriverAvailabilityRequest {

			let createDriverAvailabilityRequest = new CreateDriverAvailabilityRequest;

			createDriverAvailabilityRequest.startDate = request.startDate;
			createDriverAvailabilityRequest.endDate = request.endDate;

			return createDriverAvailabilityRequest;

		}

	}

}