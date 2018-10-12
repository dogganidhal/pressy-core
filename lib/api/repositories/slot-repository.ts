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

  public async searchSlots(types: SlotType[], from: Date, to: Date): Promise<Slot[]> {
    
    const repository = await this._slotRepositoryPromise;
    const queryBuilder = repository.createQueryBuilder()
      .where("startdate >= :startDate", {startDate: from});
    
    types.forEach(type => {
    
      const durationInMinutes = Slot.getDurationInMinutes(type);
      queryBuilder
        .andWhere("type = :type", {type: type})
        .orWhere("startdate <= :safeStartDate", {safeStartDate: DateUtils.dateBySubsctractingTimeInterval(to, durationInMinutes * 1000000)});

    });

    const slots = await queryBuilder.execute();

    return slots;

  }

}