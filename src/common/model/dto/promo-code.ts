import { Required } from "../../../common/annotations";

export class VerifyCouponRequestDto {
  public id: string;
}
export class CreateCouponRequestDto {
  duration: string;
  amount_off: number;
  currency: string;
  name: string;
  duration_in_months: number;
  redeem_by: number;
  id: string;
}

export class VerifyCouponResponseDto {
  @Required()
  public status: boolean;
  constructor(response: IVerifyCouponResponse) {
    this.status = response.status;
  }
}

export interface IVerifyCouponResponse {
  status: boolean;
}
