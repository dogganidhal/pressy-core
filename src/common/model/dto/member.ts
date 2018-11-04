import {Required} from "../../annotations";

export interface IMemberInfo {
	id: number,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	created: Date
}

export class MemberInfoDTO {

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

export class MemberRegistrationDTO {

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

export class MemberPasswordResetCodeDTO {

	@Required
	public code: string;

}

export class MemberPasswordResetCodeRequestDTO {

	@Required
	public email: string;

}

export class PersonPasswordResetRequestDTO {

	@Required
	public oldPassword: string;

	@Required
	public newPassword: string;

}

export class LoginRequestDTO {

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

export class LoginResponseDTO {

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

export class RefreshCredentialsRequestDTO {

	@Required
	public refreshToken: string;

}

export class MobileDeviceDTO {
	public deviceId: string;
}