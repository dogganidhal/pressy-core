import {Required} from "../../annotations";

export interface IPersonInfo {
	id: number,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	created: Date
}

export class PersonInfo {

	public id: number;
	public firstName: string;
	public lastName: string;
	public email: string;
	public phone: string;
	public created: Date;

	constructor();
	constructor(personInfo: IPersonInfo);
	constructor(personInfo?: IPersonInfo) {
		if (personInfo) {
			this.id = personInfo.id;
			this.firstName = personInfo.firstName;
			this.lastName = personInfo.lastName;
			this.email = personInfo.email;
			this.phone = personInfo.phone;
			this.created = personInfo.created;
		}
	}

}

export class CreatePersonRequestDto {

	@Required()
	public firstName: string;
	@Required()
	public lastName: string;
	@Required()
	public email: string;
	@Required()
	public password: string;
	@Required()
	public phone: string;

}

export class UpdatePersonInfoRequestDto {

	@Required()
	public firstName: string;
	@Required()
	public lastName: string;
	@Required()
	public email: string;
	@Required()
	public phone: string;

}

export class ResetCodeDto {

	@Required()
	public code: string;

}

export class ResetCodeRequestDto {

	@Required()
	public email: string;

}

export class ResetPasswordRequestDto {

	@Required()
	public oldPassword: string;

	@Required()
	public newPassword: string;

}

export class LoginRequestDto {

	@Required()
	public password: string;

	@Required()
	public email: string

}

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn?: number;
	type?: string;
}

export class LoginResponseDto {

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

export class RefreshCredentialsRequestDto {

	@Required()
	public refreshToken: string;

}

export class MobileDeviceDto {
	public deviceId: string;
}