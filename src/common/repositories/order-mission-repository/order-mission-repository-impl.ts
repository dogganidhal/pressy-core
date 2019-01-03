import { BaseRepository } from "../base-repository";
import { IOrderMissionRepository } from ".";
import { Driver } from "../../model/entity/users/driver/driver";
import { OrderMission } from "../../model/entity/order";
import { Repository, MoreThan, Between } from "typeorm";
import { DateUtils } from "../../utils";


export class OrderMissionRepositoryImpl extends BaseRepository implements IOrderMissionRepository {

  private _orderMissionRepository: Repository<OrderMission> = this.connection.getRepository(OrderMission);
  
  public async getOrderMissionsForDriver(driver: Driver): Promise<OrderMission[]> {
    return this._orderMissionRepository.find({
      driver: driver,
      order: {
        pickupSlot: {
          startDate: Between(DateUtils.now(), DateUtils.addDaysFromNow(1))
        }
      },
    });
  }

  public async getMissionHistoryForDriver(driver: Driver): Promise<OrderMission[]> {
    return this._orderMissionRepository.find({
      select: ["driver", "order", "order", "created", "id", "type"],
      where: {driver: driver},
      relations: [
        "driver", "driver.person",
        "order", "order.pickupSlot", "order.deliverySlot", "order.address"
      ]
    });
  }

}