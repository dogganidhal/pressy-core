import { Required } from "../../../annotations";
import { OrderType } from "../../entity/order";
import { CreateSlotRequestDto, CreateAddressRequestDto, CreateOrderElementRequest } from "..";


export class EditOrderRequestDto {

	@Required()
	public id: number;

	public type?: OrderType;
	public pickupSlot?: CreateSlotRequestDto;
	public deliverySlot?: CreateSlotRequestDto;
	public address?: CreateAddressRequestDto;
	public elements?: Array<CreateOrderElementRequest>;
	public memberId?: number;

}