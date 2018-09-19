import { JsonConverter, JsonCustomConvert, JsonConvert } from "json2typescript";
import { MemberStatus, AccessPrivilege, MemberGroup } from "../model/entity";


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
        case MemberStatus.UNACTIVE: return "UNACTIVE";
        case MemberStatus.SUSPENDED: return "SUSPENDED";
      }
    }
    
    public deserialize(data: string): MemberStatus {
      switch (data) {
        case "ACTIVE": return MemberStatus.ACTIVE;
        case "UNACTIVE": return MemberStatus.UNACTIVE;
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

  export function deserializeObject<TModel>(json: object | string, classReference: {new (): TModel}): string {
    return convert.deserialize(typeof json == "string" ? JSON.parse(json) : json, classReference);
  }

}