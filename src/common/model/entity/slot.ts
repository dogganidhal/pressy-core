import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {slot} from "../dto";

export enum SlotType {
  LIGHT = 1,
  EXPRESS = 2
}

@Entity()
export class Slot {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({name: "startdate", nullable: false})
  public startDate: Date;

  @Column({nullable: false})
  public type: SlotType = SlotType.LIGHT;

  public static create(slot: slot.ISlot): Slot {

    let slotEntity = new Slot;

    slotEntity.startDate = slot.startDate;
    slotEntity.type = slot.type;

    return slotEntity

  }

  public static getDurationInMinutes(type: SlotType): number {

    switch(type) {
      case SlotType.LIGHT:
        return 120;
      case SlotType.EXPRESS:
        return 30;
    }

  }
  
}