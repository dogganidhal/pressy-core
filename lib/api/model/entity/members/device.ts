import { Member } from './member';
import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";


@Entity()
export class MobileDevice {

  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => Member)
  @JoinColumn()
  public member: Member;

  public static create(member: Member, deviceId: string): MobileDevice {
    const device = new MobileDevice();

    device.id = deviceId;
    device.member = member;

    return device;
  }

}