import { JsonConverter, JsonCustomConvert, JsonConvert, ValueCheckingMode } from "json2typescript";
import dateFormat from "dateformat";
import { AuthPrivilege } from "../repositories";


export namespace JSONSerialization {

  const convert: JsonConvert = new JsonConvert();

  convert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

  @JsonConverter
  export class UTCDateConvert implements JsonCustomConvert<Date> {

    public serialize(date: Date): string {
      return date.toISOString();
    }
    public deserialize(utc: string): Date {
        return new Date(utc);
    }

  }

  @JsonConverter
  export class CreditCardExpiryDateConvert implements JsonCustomConvert<Date> {

    public serialize(date: Date): string {
      return dateFormat(date, "mm/yy");
    }
    public deserialize(exp: string): Date {
      const [month, year] = exp.split("/");
      return new Date((parseInt(year) % 100) + 2000, parseInt(month) - 1);
    }

  }

  @JsonConverter
  export class AuthPrivilegeConvert implements JsonCustomConvert<AuthPrivilege> {
    serialize(data: AuthPrivilege) {
      return data == AuthPrivilege.BASIC ? "BASIC" : "SUPERUSER";
    }    
    deserialize(data: any): AuthPrivilege {
      return data == "BASIC" ? AuthPrivilege.BASIC : AuthPrivilege.SUPERUSER;
    }

  }

  export function serializeObject(obj: any): string {
    return convert.serialize(obj);
  }

  export function deserializeObject<TModel>(json: object | string, classReference: {new (): TModel}): TModel {
    return convert.deserialize(typeof json == "string" ? JSON.parse(json) : json, classReference);
  }

}