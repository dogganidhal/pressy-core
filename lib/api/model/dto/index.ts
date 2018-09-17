import { JsonObject, JsonProperty } from "json2typescript";

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