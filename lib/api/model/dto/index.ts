import { JsonObject, JsonProperty } from "json2typescript";
import { MemberPasswordResetCode } from "../entity";

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