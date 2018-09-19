import { JsonObject, JsonProperty } from "json2typescript";
import { MemberPasswordResetCode, MemberStatus, MemberGroup, Member } from "../entity";
import { AccessToken } from "../entity/auth";
import { JSONSerialization } from "../../utils/json-serialization";

@JsonObject
export class MemberInfoDTO {

  @JsonProperty("id", Number)
  public id: number;

  @JsonProperty("first_name", String)
  public firstName: string;

  @JsonProperty("last_name", String)
  public lastName: string;

  @JsonProperty("email", String)
  public email: string;

  @JsonProperty("phone", String)
  public phone: string;

  @JsonProperty("status", JSONSerialization.MemberStatusConverter)
  public status: MemberStatus;

  @JsonProperty("group", JSONSerialization.MemberGroupConverter)
  public group: MemberGroup;

  @JsonProperty("created", JSONSerialization.UTCDateConvert)
  public created: Date;

  @JsonProperty("secret", String)
  public secret: string;

  public static create(member: Member): MemberInfoDTO {
    const memberDTO = new MemberInfoDTO();

    memberDTO.id = member.id;
    memberDTO.firstName = member.firstName;
    memberDTO.lastName = member.lastName;
    memberDTO.email = member.email;
    memberDTO.phone = member.phone;
    memberDTO.status = member.status;
    memberDTO.secret = member.secret;
    memberDTO.group = member.group;

    return memberDTO;
  }

}

@JsonObject
export class MemberRegistrationDTO {

  @JsonProperty("first_name", String)
  public firstName: string = "";

  @JsonProperty("last_name", String)
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

  @JsonProperty("member_id", Number)
  public memberId: number = -1;

  public static create(resetCode: MemberPasswordResetCode): MemberPasswordResetCodeDTO {
    const resetCodeDTO = new MemberPasswordResetCodeDTO();

    resetCodeDTO.code = resetCode.id!;
    resetCodeDTO.memberId = resetCode.member!.id!;

    return resetCodeDTO;
  }

}

@JsonObject
export class MemberPasswordResetCodeRequestDTO {

  @JsonProperty("email", String)
  public email: string = "";

}

@JsonObject
export class MemberPasswordResetRequestDTO {

  @JsonProperty("old_password", String)
  public oldPassword: string = "";

  @JsonProperty("new_password", String)
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

  @JsonProperty("access_token", String)
  public accessToken: string = "";

  @JsonProperty("refresh_token", String)
  public refreshToken: string = "";

  @JsonProperty("expires_in", Number)
  public expiresIn: number = 3600;

  @JsonProperty("type", String)
  public type: string = "Bearer";

  public static create(accessToken: AccessToken): LoginResponseDTO {
    const response = new LoginResponseDTO();
    response.accessToken = accessToken.token;
    response.refreshToken = accessToken.refreshToken;
    response.type = "Bearer";
    return response;
  }

}