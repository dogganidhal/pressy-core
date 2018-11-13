import { SlotType } from '../model/entity/slot';
import { Slot } from '../model/entity/slot';
import { Repository, Brackets } from "typeorm";
import { DateUtils } from '../utils';
import { BaseRepository } from './base-repository';


export class SlotRepository extends BaseRepository {

  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);

  public async getSlotById(id: number): Promise<Slot | undefined> {
    return this._slotRepository.findOne(id);
  }

  public async searchSlots(types: SlotType[], from: Date, to: Date): Promise<Slot[]> {

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
    
    const slots = await queryBuilder.getMany();

    return slots;

  }

}