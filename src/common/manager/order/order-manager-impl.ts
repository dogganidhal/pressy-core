import { IOrderManager } from ".";
import { CreateOrderRequestDto } from "../../model/dto";
import { Order } from "../../model/entity/order";
import { Member } from "../../model/entity/users/member";
import { exception } from "../../errors";
import { RepositoryFactory } from "../../repository/factory";
import { ISlotRepository, IOrderRepository } from "../../repository";


export class OrderManagerImpl implements IOrderManager {

  private _slotRepository: ISlotRepository = RepositoryFactory.instance.slotRepository;
  private _orderRepository: IOrderRepository = RepositoryFactory.instance.orderRepository;

  public async order(member: Member, request: CreateOrderRequestDto): Promise<Order> {

    if (!member.isActive())
      throw new exception.InactiveMemberException(member);

    let pickupSlot = await this._slotRepository.getSlotById(request.pickupSlotId);

    if (!pickupSlot)
      throw new exception.SlotNotFoundException(request.pickupSlotId);

    let deliverySlot = await this._slotRepository.getSlotById(request.deliverySlotId);

    if (!deliverySlot)
      throw new exception.SlotNotFoundException(request.deliverySlotId);

    let addressRepository = RepositoryFactory.instance.addressRepository;
    let addressEntity = await addressRepository.getAddressById(request.addressId);

    if (!addressEntity)
      throw new exception.AddressNotFoundException(request.addressId);

    await Promise.all([
      deliverySlot = await this._slotRepository.createSlot(deliverySlot),
      pickupSlot = await this._slotRepository.createSlot(pickupSlot),
    ]);

    let order = Order.create({
      member: member, pickupSlot: pickupSlot, deliverySlot: deliverySlot,
      address: await addressRepository.duplicateAddress(addressEntity),
      type: request.type
    });

    return await this._orderRepository.createOrder(order);

  }

}