import { Required } from "../../../annotations";
import { OrderType } from "../../entity/order";
import { CreateSlotRequestDto, CreateAddressRequestDto, CreateOrderItemRequest } from "..";


export class EditOrderRequestDto {

	@Required()
	public id: number;

	public type?: OrderType;
	public pickupSlot?: CreateSlotRequestDto;
	public deliverySlot?: CreateSlotRequestDto;
	public address?: CreateAddressRequestDto;
	public items?: Array<CreateOrderItemRequest>;
	public memberId?: number;

}