import { SlotType } from './../model/entity/order/slot';
import { Slot } from '../model/entity/order/slot';
import { Repository } from "typeorm";
import { createConnection } from 'typeorm';
import { DateUtils } from '../utils';


export class SlotRepository  {

  public static instance: SlotRepository = new SlotRepository();

  private _slotRepositoryPromise: Promise<Repository<Slot>>;

  constructor() {
    this._slotRepositoryPromise = new Promise((resolve, reject) => {
      createConnection()
      .then(connection => {
        resolve(connection.getRepository(Slot));
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public async getSlotById(id: number): Promise<Slot | undefined> {
    
    const repository = await this._slotRepositoryPromise;
    return repository.findOne(id);

  }

  public async searchSlots(type: SlotType, from: Date, to: Date): Promise<Slot[]> {

    const durationInMinutes = Slot.getDurationInMinutes(type);
    const repository = await this._slotRepositoryPromise;
    const slots = await repository.createQueryBuilder()
      .where("type = :type", {type: type})
      .andWhere("startdate >= :startDate", {startDate: from})
      .andWhere("startdate <= :safeStartDate", {safeStartDate: DateUtils.dateBySubsctractingTimeInterval(to, durationInMinutes * 1000000)})
      .execute();

    return slots;

  }

}