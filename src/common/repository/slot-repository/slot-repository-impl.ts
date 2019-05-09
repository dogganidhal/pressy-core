import {Slot, SlotType} from '../../model/entity/slot';
import {Between, FindConditions, Repository, MoreThan} from "typeorm";
import {DateUtils} from '../../utils';
import {BaseRepository} from '../base-repository';
import { CreateSlotRequestDto, EditSlotRequestDto, DeleteSlotRequest } from '../../model/dto';
import { ISlotRepository } from '.';
import { exception } from '../../errors';
import { APIError } from '../../errors/api-error';


export class SlotRepositoryImpl extends BaseRepository implements ISlotRepository {

  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);

  public async getSlotById(id: number): Promise<Slot | undefined> {
    return this._slotRepository.findOne(id);
  }

  public async createSlot(createSlotRequest: CreateSlotRequestDto): Promise<Slot> {
    return await this._slotRepository.save(Slot.create(createSlotRequest));
  }

  public async getDeliverySlotsForPickupSlot(pickupSlotId: number): Promise<Slot[]> {

    let pickupSlot = await this._slotRepository.findOne(pickupSlotId);

    if (!pickupSlot) 
      throw new exception.SlotNotFoundException(pickupSlotId);

    var minimumStartDate: Date = DateUtils.addDays(pickupSlot.startDate, 2);
    switch(pickupSlot.type) {
      case SlotType.STANDARD:
        minimumStartDate = DateUtils.addDays(pickupSlot.startDate, 2);
        break;
      case SlotType.VIP:
        minimumStartDate = DateUtils.addDays(pickupSlot.startDate, 1);
        break;
    }

    var deliverySlots = await this._slotRepository.find({where: {
      startDate: MoreThan(minimumStartDate)
    }});

    return deliverySlots;

  }

  public async getAvailableSlots(type?: string): Promise<Slot[]> {

    let startDate = DateUtils.addDays(new Date(), 1);
    let maxEndDate = DateUtils.addMinutes(DateUtils.addDays(new Date(), 8), -30);

    let findOptions: FindConditions<Slot> = {
      startDate: Between(startDate, maxEndDate)
    };

    if (type)
      findOptions = {
        ...findOptions,
        type: SlotType.fromString(type)
      };

    return this._slotRepository.find({where: findOptions});

  }

  public async editSlot(editSlotRequest: EditSlotRequestDto): Promise<Slot> {
    
    let slot = await this._slotRepository.findOne(editSlotRequest.id);

    if (!slot)
      throw new exception.SlotNotFoundException(editSlotRequest.id);

    slot.availableDrivers = editSlotRequest.availableDrivers || slot.availableDrivers;
    slot.startDate = editSlotRequest.startDate || slot.startDate;
    slot.type = editSlotRequest.type || slot.type;

    return await this._slotRepository.save(slot);

  }

  public async deleteSlot(deleteSlotRequest: DeleteSlotRequest): Promise<void> {
    await this._slotRepository.delete(deleteSlotRequest.id);
  }

}