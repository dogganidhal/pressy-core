import { Address, IAddress } from "./address";
import { IPersonInfo, PersonInfo } from "./person";


export interface IMemberInfo extends IPersonInfo {
	addresses: IAddress[]
}

export class MemberInfo extends PersonInfo {

	public addresses: Address[];

	constructor()
	constructor(memberInfo: MemberInfo);
	constructor(memberInfo?: IMemberInfo) {
		super(memberInfo as IPersonInfo);
		if (memberInfo) {
			this.addresses = memberInfo.addresses.map(a => new Address(a));
		}
	}

}