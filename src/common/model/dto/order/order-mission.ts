import { OrderMission, OrderMissionType } from "../../entity/order";
import { DriverInfoDto } from "../driver";
import { OrderDto } from "./order";


export class OrderMissionDto {

  public id: number;
  public type: OrderMissionType;
  public created: Date;
  public order: OrderDto;
  public driver: DriverInfoDto;

  public constructor(mission: OrderMission) {
    this.id = mission.id;
    this.created = mission.created;
    this.type = mission.type;
    this.order = new OrderDto(mission.order);
    this.driver = new DriverInfoDto(mission.driver.person);
  }

}