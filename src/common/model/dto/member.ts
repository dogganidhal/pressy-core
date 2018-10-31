import { JsonObject, JsonProperty } from "json2typescript";
import { JSONSerialization } from "../../utils/json-serialization";
import { Member } from "../entity/users/member";

@JsonObject
export class MemberInfoDTO {

  @JsonProperty("id", Number)
  public id: number;

  @JsonProperty("firstName", String)
  public firstName: string;

  @JsonProperty("lastName", String)
  public lastName: string;

  @JsonProperty("email", String)
  public email: string;

  @JsonProperty("phone", String)
  public phone: string;

  @JsonProperty("created", JSONSerialization.UTCDateConvert)
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

@JsonObject
export class MemberRegistrationDTO {

  @JsonProperty("firstName", String)
  public firstName: string = "";

  @JsonProperty("lastName", String)
  public lastName: string = "";

  @JsonProperty("email", String)
  public email: string = "";

  @JsonProperty("password", String)
  public password: string = "";

  @JsonProperty("phone", String)
  public phone: string = "";

}

@JsonObject
export class MemberPasswordResetCodeDTO {

  @JsonProperty("code", String)
  public code: string = "";

  public static create(code: string): MemberPasswordResetCodeDTO {
    const resetCodeDTO = new MemberPasswordResetCodeDTO();

    resetCodeDTO.code = code;

    return resetCodeDTO;
  }

}

@JsonObject
export class MemberPasswordResetCodeRequestDTO {

  @JsonProperty("email", String)
  public email: string = "";

  public static create(email: string): MemberPasswordResetCodeRequestDTO {
    const resetCodeRequest = new MemberPasswordResetCodeRequestDTO();
    resetCodeRequest.email = email;
    return resetCodeRequest;
  }

}

@JsonObject
export class PersonPasswordResetRequestDTO {

  @JsonProperty("oldPassword", String)
  public oldPassword: string = "";

  @JsonProperty("newPassword", String)
  public newPassword: string = "";

}

@JsonObject
export class LoginRequestDTO {

  @JsonProperty("password", String)
  public password: string = "";

  @JsonProperty("email", String)
  public email: string = "";

}

@JsonObject
export class LoginResponseDTO {

  @JsonProperty("accessToken", String)
  public accessToken: string = "";

  @JsonProperty("refreshToken", String)
  public refreshToken: string = "";

  @JsonProperty("expiresIn", Number)
  public expiresIn: number = 3600;

  @JsonProperty("type", String)
  public type: string = "Bearer";

  public static create(accessToken: string, refreshToken: string): LoginResponseDTO {
    const response = new LoginResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.type = "Bearer";
    return response;
  }

}

@JsonObject
export class RefreshCredentialsRequestDTO {

  @JsonProperty("refresh_token", String)
  public refreshToken: string = "";

}

@JsonObject
export class MobileDeviceDTO {

  @JsonProperty("deviceId", String)
  public deviceId: string = "";

  public static create(id: string): MobileDeviceDTO {
    const device = new MobileDeviceDTO();
    device.deviceId = id;
    return device;
  }

}