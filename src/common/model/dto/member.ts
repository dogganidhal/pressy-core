import { AddressDto, IAddress } from "./address";
import { IPersonInfo, PersonInfo } from "./person";


export interface IMemberInfo extends IPersonInfo {
	addresses: IAddress[]
}

export class MemberInfoDto extends PersonInfo {

	public addresses: AddressDto[];

	constructor()
	constructor(memberInfo: MemberInfoDto);
	constructor(memberInfo?: IMemberInfo) {
		super(memberInfo as IPersonInfo);
		if (memberInfo && memberInfo.addresses) {
			this.addresses = memberInfo.addresses.map(a => new AddressDto(a));
		}
	}

}