import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import {Person} from "./person";


@Entity()
export class MobileDevice {

  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => Person)
  @JoinColumn()
  public person: Person;

  public static create(person: Person, deviceId: string): MobileDevice {
    const device = new MobileDevice();

    device.id = deviceId;
    device.person = person;

    return device;
  }

}