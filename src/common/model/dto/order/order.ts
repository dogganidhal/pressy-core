import { OrderType, Order } from "../../entity/order";
import { SlotDto, AddressDto, DriverInfoDto, MemberInfoDto, OrderItemDto } from "..";


export class OrderDto {

	public id: number;
	public type: OrderType;
	public pickupSlot: SlotDto;
	public deliverySlot: SlotDto;
	public address: AddressDto;
	public items: Array<OrderItemDto>;
	public driver: DriverInfoDto;
	public member: MemberInfoDto;

	constructor(order: Order) {
		
		this.id = order.id;
		this.type = order.type;
		this.pickupSlot = new SlotDto(order.pickupSlot);
		this.deliverySlot = new SlotDto(order.pickupSlot);
		this.address = new AddressDto(order.address);
		this.member = new MemberInfoDto({
			...order.member.person,
			addresses: order.member.addresses,
			paymentAccounts: order.member.paymentAccounts
		});

		if (order.items)
			this.items = order.items.map(item => new OrderItemDto(item));	

	}

}