import { JsonObject, JsonProperty } from "json2typescript";
import { MemberPasswordResetCode, AccessToken, RefreshToken } from "../entity";
import { DateUtils } from "../../utils";

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

  @JsonProperty("email", String, true)
  public email?: string = undefined;

  @JsonProperty("phone", String, true)
  public phone?: string = undefined;

}

@JsonObject
export class LoginResponseDTO {

  @JsonProperty("access_token", String)
  public accessToken: string = "";

  @JsonProperty("refresh_token", String)
  public refreshToken: string = "";

  @JsonProperty("expires_in", Number)
  public expiresIn: number = 3600;

  public static create(accessToken: AccessToken, refreshToken: RefreshToken): LoginResponseDTO {
    const response = new LoginResponseDTO();
    response.accessToken = accessToken.code;
    response.refreshToken = refreshToken.code;
    response.expiresIn = parseInt(((accessToken.expiryDate.getTime() - DateUtils.now().getTime()) / 1000).toFixed(0));
    return response;
  }

}