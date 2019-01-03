import { OrderType, Order } from "../../entity/order";
import { SlotDto, AddressDto, DriverInfoDto, MemberInfoDto, OrderElementDto } from "..";


export class OrderDto {

	public id: number;
	public type: OrderType;
	public pickupSlot: SlotDto;
	public deliverySlot: SlotDto;
	public address: AddressDto;
	public elements: Array<OrderElementDto>;
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
			addresses: order.member.addresses
		});

		if (order.elements)
			this.elements = order.elements.map(element => new OrderElementDto(element));	

	}

}