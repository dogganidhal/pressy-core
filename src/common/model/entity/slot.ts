import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CreateSlotRequestDto } from "../dto";

export enum SlotType {
  GOLD = 1,
  SILVER = 2,
  PLATINUM = 3
}

export namespace SlotType {

  export function fromString(type: string): SlotType | undefined {
    switch (type) {
      case "gold":
        return SlotType.GOLD;
      case "platinum":
        return SlotType.PLATINUM;
      case "silver":
        return SlotType.SILVER;
      default:
        return undefined;
    }

  }

  export function toString(type: SlotType): string | undefined {
    switch (type) {
      case SlotType.GOLD:
        return "gold";
      case SlotType.PLATINUM:
        return "platinum";
      case SlotType.SILVER:
        return "silver";
      default:
        return undefined;
    }
  }

}

@Entity()
export class Slot {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public startDate: Date;

  @Column({nullable: false})
  public type: SlotType = SlotType.GOLD;

  @Column({nullable: false})
	public availableDrivers: number;

  public static create(slot: CreateSlotRequestDto): Slot {

    let slotEntity = new Slot;

    slotEntity.startDate = slot.startDate;
    slotEntity.type = slot.type;
    slotEntity.availableDrivers = slot.availableDrivers;

    return slotEntity

  }
  
}