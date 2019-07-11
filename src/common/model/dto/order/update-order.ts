import { Required } from "../../../annotations";

export enum UpdateOrderReason {
  CLIENT_ABSENT = "absent",
  DELIVERED = "delivered"
}

export class UpdateOrderRequestDto {

  @Required()
  public id: number;

  @Required()
  public reason: UpdateOrderReason;

  public payload?: any;

}