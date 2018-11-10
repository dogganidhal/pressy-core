import {Required} from "../../annotations";

export module member {

	export interface IMemberInfo {
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		phone: string,
		created: Date
	}

	export class MemberInfo {

		public id: number;
		public firstName: string;
		public lastName: string;
		public email: string;
		public phone: string;
		public created: Date;

		constructor(memberInfo: IMemberInfo) {
			this.id = memberInfo.id;
			this.firstName = memberInfo.firstName;
			this.lastName = memberInfo.lastName;
			this.email = memberInfo.email;
			this.phone = memberInfo.phone;
			this.created = memberInfo.created;
		}

	}

	export class CreateMemberRequest {

		@Required
		public firstName: string;
		@Required
		public lastName: string;
		@Required
		public email: string;
		@Required
		public password: string;
		@Required
		public phone: string;

	}

	export class ResetCode {

		@Required
		public code: string;

	}

	export class ResetCodeRequest {

		@Required
		public email: string;

	}

	export class ResetPasswordRequest {

		@Required
		public oldPassword: string;

		@Required
		public newPassword: string;

	}

	export class LoginRequest {

		@Required
		public password: string;

		@Required
		public email: string

	}

	export interface ILoginResponse {
		accessToken: string;
		refreshToken: string;
		expiresIn?: number;
		type?: string;
	}

	export class LoginResponse {

		public accessToken: string;
		public refreshToken: string;
		public expiresIn: number;
		public type: string;

		constructor(loginResponse: ILoginResponse) {
			this.accessToken = loginResponse.accessToken;
			this.refreshToken = loginResponse.refreshToken;
			this.expiresIn = loginResponse.expiresIn || 3600;
			this.type = loginResponse.type || "Bearer";
		}

	}

	export class RefreshCredentialsRequest {

		@Required
		public refreshToken: string;

	}

	export class MobileDevice {
		public deviceId: string;
	}

}