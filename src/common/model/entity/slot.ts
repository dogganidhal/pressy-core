import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CreateSlotRequestDto } from "../dto";

export enum SlotType {
  STANDARD = 1,
  VIP = 2
}

export namespace SlotType {

  export function fromString(type: string): SlotType | undefined {
    switch (type) {
      case "standard":
        return SlotType.STANDARD;
      case "vip":
        return SlotType.VIP;
      default:
        return undefined;
    }

  }

  export function toString(type: SlotType): string | undefined {
    switch (type) {
      case SlotType.STANDARD:
        return "standard";
      case SlotType.VIP:
        return "vip";
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
  public type: SlotType = SlotType.STANDARD;

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