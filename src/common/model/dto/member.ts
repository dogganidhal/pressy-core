import {person} from "./person";
import {address} from "./address";


export namespace member {

	export interface IMemberInfo extends person.IPersonInfo {
		addresses: address.IAddress[]
	}

	export class MemberInfo extends person.PersonInfo {

		public addresses: address.Address[];

		constructor(memberInfo?: IMemberInfo) {
			super(memberInfo);
			if (memberInfo) {
				this.addresses = memberInfo.addresses.map(a => new address.Address(a));
			}
		}

	}

}