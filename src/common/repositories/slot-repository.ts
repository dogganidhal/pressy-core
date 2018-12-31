import {Slot, SlotType} from '../model/entity/slot';
import {Between, FindConditions, Repository} from "typeorm";
import {DateUtils} from '../utils';
import {BaseRepository} from './base-repository';
import { CreateSlotRequestDto } from '../model/dto';


export class SlotRepository extends BaseRepository {

  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);

  public async getSlotById(id: number): Promise<Slot | undefined> {
    return this._slotRepository.findOne(id);
  }

  public async createSlot(createSlotRequest: CreateSlotRequestDto): Promise<Slot> {
    return await this._slotRepository.save(Slot.create(createSlotRequest));
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

}