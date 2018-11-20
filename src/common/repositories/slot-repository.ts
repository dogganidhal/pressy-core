import {Slot} from '../model/entity/slot';
import {Brackets, Repository} from "typeorm";
import {DateUtils} from '../utils';
import {BaseRepository} from './base-repository';
import {slot} from "../model/dto";
import SearchSlotRequest = slot.SearchSlotRequest;


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

  public async searchSlots(request: SearchSlotRequest): Promise<Slot[]> {

    let {from, to, types} = request;

    const queryBuilder = this._slotRepository.createQueryBuilder()
      .where("startdate >= :startDate", {startDate: from})
      .andWhere(new Brackets((subqb) => {

        for (const type of types) {
          const durationInMinutes = Slot.getDurationInMinutes(type);
          subqb.orWhere(new Brackets((typeqb) => {

            const safeStartDate = DateUtils.dateBySubsctractingTimeInterval(to, durationInMinutes * 1000000);

            typeqb.where(`type = ${type}`)
            typeqb.andWhere(`startdate <= '${safeStartDate.toISOString()}'::DATE`);

          }));
        }

      }));

  return await queryBuilder.getMany();

  }

}