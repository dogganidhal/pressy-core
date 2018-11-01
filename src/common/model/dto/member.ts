import { Member } from "../entity/users/member";

export class MemberInfoDTO {

  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;
  public created: Date;

  public static create(member: Member): MemberInfoDTO {
    const memberDTO = new MemberInfoDTO();

    memberDTO.id = member.id;
    memberDTO.firstName = member.person.firstName;
    memberDTO.lastName = member.person.lastName;
    memberDTO.email = member.person.email;
    memberDTO.phone = member.person.phone;

    return memberDTO;
  }

}

export class MemberRegistrationDTO {

  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public password: string = "";
  public phone: string = "";

}

export class MemberPasswordResetCodeDTO {

  public code: string = "";

  public static create(code: string): MemberPasswordResetCodeDTO {
    const resetCodeDTO = new MemberPasswordResetCodeDTO();

    resetCodeDTO.code = code;

    return resetCodeDTO;
  }

}

export class MemberPasswordResetCodeRequestDTO {

  public email: string = "";

  public static create(email: string): MemberPasswordResetCodeRequestDTO {
    const resetCodeRequest = new MemberPasswordResetCodeRequestDTO();
    resetCodeRequest.email = email;
    return resetCodeRequest;
  }

}

export class PersonPasswordResetRequestDTO {

  public oldPassword: string = "";
  public newPassword: string = "";

}

export class LoginRequestDTO {

  public password: string = "";
  public email: string = "";

}

export class LoginResponseDTO {

  public accessToken: string = "";
  public refreshToken: string = "";
  public expiresIn: number = 3600;
  public type: string = "Bearer";

  public static create(accessToken: string, refreshToken: string): LoginResponseDTO {
    const response = new LoginResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.type = "Bearer";
    return response;
  }

}

export class RefreshCredentialsRequestDTO {

  public refreshToken: string = "";

}

export class MobileDeviceDTO {

  public deviceId: string = "";

  public static create(id: string): MobileDeviceDTO {
    const device = new MobileDeviceDTO();
    device.deviceId = id;
    return device;
  }

}