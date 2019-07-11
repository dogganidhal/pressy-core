import { BaseRepository } from "../base-repository";
import { IOrderMissionRepository } from ".";
import { Driver } from "../../model/entity/users/driver/driver";
import { OrderMission } from "../../model/entity/order";
import { Repository, Between } from "typeorm";
import { DateUtils } from "../../utils";


export class OrderMissionRepositoryImpl extends BaseRepository implements IOrderMissionRepository {

  private _orderMissionRepository: Repository<OrderMission> = this.connection.getRepository(OrderMission);
  
  public async getOrderMissionsForDriver(driver: Driver): Promise<OrderMission[]> {
    return this._orderMissionRepository.find({
      relations: [
        "order", "order.pickupSlot", "order.deliverySlot", "order.address", "order.member",
        "driver", "driver.person", "order.member.person"
      ],
      where: {
        driver: {
          id: driver.id
        },
        order: {
          pickupSlot: {
            startDate: Between(DateUtils.now(), DateUtils.addDaysFromNow(1))
          }
        },
      }
    });
  }

  public async getMissionHistoryForDriver(driver: Driver, skip?: number, take: number = 10): Promise<OrderMission[]> {
    return this._orderMissionRepository.find({
      relations: [
        "order", "order.pickupSlot", "order.deliverySlot", "order.address", "order.member",
        "driver", "driver.person", "order.member.person"
      ],
      where: {
        driver: {
          id: driver.id
        }
      },
      skip: skip,
      take: take
    });
  }

}