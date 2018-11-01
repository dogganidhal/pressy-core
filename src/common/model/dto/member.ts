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

export interface IMemberRegistration {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
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

	constructor(memberRegistration: IMemberRegistration) {
		this.firstName = memberRegistration.firstName;
		this.lastName = memberRegistration.lastName;
		this.email = memberRegistration.email;
		this.phone = memberRegistration.phone;
		this.password = memberRegistration.password;
  }

}

export class MemberPasswordResetCodeDTO {
  constructor(public code: string) {}
}

export class MemberPasswordResetCodeRequestDTO {
	constructor(public email: string) {}
}

export class PersonPasswordResetRequestDTO {
  constructor(public oldPassword: string, public newPassword: string) {}
}

export class LoginRequestDTO {
  constructor(public password: string, public email: string) {}
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
  constructor(public refreshToken: string) {}
}

export class MobileDeviceDTO {
  constructor(public deviceId: string) {}
}