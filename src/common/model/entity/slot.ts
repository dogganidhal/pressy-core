import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CreateSlotRequest } from "../dto";

export enum SlotType {
  GOLD = "gold",
  SILVER = "silver",
  PLATINIUM = "platinium"
}

@Entity()
export class Slot {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public startDate: Date;

  @Column({nullable: false})
  public type: SlotType = SlotType.GOLD;

  public static create(slot: CreateSlotRequest): Slot {

    let slotEntity = new Slot;

    slotEntity.startDate = slot.startDate;
    slotEntity.type = slot.type;

    return slotEntity

  }

  public static getDurationInMinutes(type: SlotType): number {

    switch(type) {
      case SlotType.GOLD:
        return 120;
      case SlotType.SILVER:
        return 30;
      case SlotType.PLATINIUM:
        return 30;
    }

  }

	public getDurationInMinutes(): number {

		switch(this.type) {
			case SlotType.GOLD:
				return 120;
			case SlotType.SILVER:
				return 30;
			case SlotType.PLATINIUM:
				return 30;
		}

	}

  public static getDeliveryFees(type: SlotType): number {

    switch (type) {
      case SlotType.GOLD:
        return 2.99;
      case SlotType.SILVER:
        return 0.00;
      case SlotType.PLATINIUM:
        return 6.99;
    }

  }
  
}