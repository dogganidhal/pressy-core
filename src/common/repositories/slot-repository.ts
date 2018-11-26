import {Slot, SlotType} from '../model/entity/slot';
import {Brackets, Repository} from "typeorm";
import {DateUtils} from '../utils';
import {BaseRepository} from './base-repository';
import {slot} from "../model/dto";


export class SlotRepository extends BaseRepository {

  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);

  public async getSlotById(id: number): Promise<Slot | undefined> {
    return this._slotRepository.findOne(id);
  }

  public async createSlot(createSlotRequest: slot.CreateSlotRequest): Promise<Slot> {

    let slot = Slot.create(createSlotRequest);

    slot = await this._slotRepository.save(slot, {});

    return slot;

  }

  public async getNextAvailableSlots(): Promise<Slot[]> {

    let startDate = DateUtils.addDays(new Date(), 1);
    let endDate = DateUtils.addDays(new Date(), 8);

    const queryBuilder = this._slotRepository.createQueryBuilder()
      .where("startdate >= :startDate", {startDate: startDate})
      .andWhere(new Brackets((subqb) => {

        for (const type of [SlotType.GOLD, SlotType.SILVER, SlotType.PLATINIUM]) {
          const durationInMinutes = Slot.getDurationInMinutes(type);
          subqb.orWhere(new Brackets((typeqb) => {

            const safeStartDate = DateUtils.dateBySubsctractingTimeInterval(endDate, durationInMinutes * 1000000);

            typeqb.where(`type = ${type}`);
            typeqb.andWhere(`startdate <= '${safeStartDate.toISOString()}'::DATE`);

          }));
        }

      }));

    return await queryBuilder.getMany();

  }

}