import { DateUtils } from './date-utils';
import { JsonConverter, JsonCustomConvert, JsonConvert } from "json2typescript";
import dateFormat from "dateformat";
import { MemberStatus, MemberGroup } from "../model/entity";
import { AccessPrivilege } from "../model";


export namespace JSONSerialization {

  const convert: JsonConvert = new JsonConvert();

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
  export class AccessPrivilegeConvert implements JsonCustomConvert<AccessPrivilege> {
    serialize(data: AccessPrivilege) {
      return data == AccessPrivilege.BASIC ? "BASIC" : "SUPERUSER";
    }    
    deserialize(data: any): AccessPrivilege {
      return data == "BASIC" ? AccessPrivilege.BASIC : AccessPrivilege.SUPERUSER;
    }

  }

  @JsonConverter
  export class MemberStatusConverter implements JsonCustomConvert<MemberStatus> {

    public serialize(data: MemberStatus): string {
      switch (data) {
        case MemberStatus.ACTIVE: return "ACTIVE";
        case MemberStatus.INACTIVE: return "INACTIVE";
        case MemberStatus.SUSPENDED: return "SUSPENDED";
      }
    }
    
    public deserialize(data: string): MemberStatus {
      switch (data) {
        case "ACTIVE": return MemberStatus.ACTIVE;
        case "INACTIVE": return MemberStatus.INACTIVE;
        case "SUSPENDED": return MemberStatus.SUSPENDED;
        default: return MemberStatus.ACTIVE;
      }
    }

  }

  @JsonConverter
  export class MemberGroupConverter implements JsonCustomConvert<MemberGroup> {

    public serialize(data: MemberGroup): string {
      switch (data) {
        case MemberGroup.CUSTOMER: return "CUSTOMER";
        case MemberGroup.DRIVER: return "DRIVER";
        case MemberGroup.LAUNDRY: return "LAUNDRY";
        case MemberGroup.SUPERUSER: return "SUPERUSER";
      }
    }
    
    public deserialize(data: string): MemberGroup {
      switch (data) {
        case "CUSTOMER": return MemberGroup.CUSTOMER;
        case "DRIVER": return MemberGroup.DRIVER;
        case "LAUNDRY": return MemberGroup.LAUNDRY;
        case "SUPERUSER": return MemberGroup.SUPERUSER;
        default: return MemberGroup.CUSTOMER;
      }
    }

  }

  export function serializeObject(obj: any): string {
    return convert.serialize(obj);
  }

  export function deserializeObject<TModel>(json: object | string, classReference: {new (): TModel}): TModel {
    return convert.deserialize(typeof json == "string" ? JSON.parse(json) : json, classReference);
  }

}