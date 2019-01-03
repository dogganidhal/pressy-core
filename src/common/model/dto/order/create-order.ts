import { Required } from "../../../annotations";
import { OrderType } from "../../entity/order";


export class CreateOrderRequestDto {

	@Required()
	public pickupSlotId: number;

	@Required()
	public deliverySlotId: number;

	@Required()
	public addressId: number;

	@Required()
	public type: OrderType;

}