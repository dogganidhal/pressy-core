import { Slot } from './../model/entity/order/slot';
import { Repository } from "typeorm";
import { createConnection } from 'typeorm';


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

}