import {Slot, SlotType} from '../model/entity/slot';
import {Brackets, Repository} from "typeorm";
import {DateUtils} from '../utils';
import {BaseRepository} from './base-repository';
import {slot} from "../model/dto";
import {DriverRepository} from "./users/driver-repository";
import {DriverSlot} from "../model/entity/users/driver/driver-slot";


export class SlotRepository extends BaseRepository {

  private _slotRepository: Repository<Slot> = this.connection.getRepository(Slot);
  private _driverRepository: DriverRepository = new DriverRepository(this.connection);

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

    const queryBuilder = this._slotRepository.createQueryBuilder("slot")
      .where(`slot.startDate >= '${startDate.toISOString()}'::DATE`)
      .andWhere(new Brackets((subqb) => {

        for (const type of [SlotType.GOLD, SlotType.SILVER, SlotType.PLATINIUM]) {
          const durationInMinutes = Slot.getDurationInMinutes(type);
          subqb.orWhere(new Brackets((typeqb) => {

            const safeStartDate = DateUtils.dateBySubsctractingTimeInterval(endDate, durationInMinutes * 1000000);

            typeqb.where(`slot.type = '${type}'`);
            typeqb.andWhere(`slot.startDate <= '${safeStartDate.toISOString()}'::DATE`);

          }));
        }

      }));

    let driverSlots: DriverSlot[];
    let slots: Slot[];

    await Promise.all([
      driverSlots = await this._driverRepository.getAllDriverSlots(startDate, endDate),
      slots = await queryBuilder.getMany()
    ]);

    console.log(driverSlots);

    return SlotRepository._computeAvailableSlots(driverSlots, slots);

  }

  private static _computeAvailableSlots(driverSlots: DriverSlot[], slots: Slot[]): Slot[] {
    // TODO: Adjust availability compute logic

    let availableSlots: Slot[] = [];

    for (let slot of slots) {
	    for (let driverSlot of driverSlots) {

		    let slotEndDate = DateUtils.addMinutes(slot.startDate, slot.getDurationInMinutes());

		    if (driverSlot.startDate < slot.startDate && driverSlot.endDate > slotEndDate) {
			    availableSlots.push(slot);
			    break;
        }

	    }
    }

    return availableSlots;

  }

}