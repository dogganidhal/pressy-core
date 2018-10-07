import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  public static getDurationInMinutes(type: SlotType): number {

    switch(type) {
      case SlotType.LIGHT:
        return 120;
      case SlotType.EXPRESS:
        return 30;
    }

  }
  
}