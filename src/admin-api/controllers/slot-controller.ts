import {BaseController} from "../../common/controller/base-controller";
import {Path, POST, GET, QueryParam} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import {Database} from "../../common/db";
import { Tags, Produces } from "typescript-rest-swagger";
import { CreateSlotRequestDto, SlotDto } from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { SlotRepository } from "../../common/repositories/slot-repository";


@Produces("application/json")
@Tags("Slots")
@Path("/slot")
export class SlotController extends BaseController {

	private _slotRepository: SlotRepository = new SlotRepository(Database.getConnection());

	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@GET
	public async getSlots(@QueryParam("type") type?: string): Promise<SlotDto[]> {
    let slots = await this._slotRepository.getAvailableSlots(type);
    return slots.map(slot => new SlotDto(slot));
  }
  
  @JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createSlot(@JSONBody(CreateSlotRequestDto) request: CreateSlotRequestDto): Promise<SlotDto> {
    let slot = await this._slotRepository.createSlot(request);
    return new SlotDto(slot);
  }

}