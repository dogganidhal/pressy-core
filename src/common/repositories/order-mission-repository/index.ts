import { Driver } from "../../model/entity/users/driver/driver";
import { OrderMission } from "../../model/entity/order";


export interface IOrderMissionRepository {

  getOrderMissionsForDriver(driver: Driver): Promise<OrderMission[]>;
  getMissionHistoryForDriver(driver: Driver, skip?: number, take?: number): Promise<OrderMission[]>;

}