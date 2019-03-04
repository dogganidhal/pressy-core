import { AddressDto, IAddress } from "./address";
import { IPersonInfo, PersonInfo } from "./person";
import { PaymentAccountDto, IPaymentAccount } from "./payment/payment-account";


export interface IMemberInfo extends IPersonInfo {
	addresses: IAddress[];
	paymentAccounts: IPaymentAccount[];
}

export class MemberInfoDto extends PersonInfo {

	public addresses: AddressDto[];
	public paymentAccounts: PaymentAccountDto[];

	constructor()
	constructor(memberInfo: MemberInfoDto);
	constructor(memberInfo?: IMemberInfo) {
		super(memberInfo as IPersonInfo);
		if (memberInfo && memberInfo.addresses) {
			this.addresses = memberInfo.addresses.map(a => new AddressDto(a));
		}
		if (memberInfo && memberInfo.paymentAccounts) {
			this.paymentAccounts = memberInfo.paymentAccounts.map(pa => new PaymentAccountDto(pa));
		}
	}

}