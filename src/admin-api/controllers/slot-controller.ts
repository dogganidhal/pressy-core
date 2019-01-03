import {BaseController} from "../../common/controller/base-controller";
import {Path, POST, GET, QueryParam, PATCH, DELETE} from "typescript-rest";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {SigningCategory} from "../../services/crypto";
import { Tags, Produces, Security } from "typescript-rest-swagger";
import { CreateSlotRequestDto, SlotDto, EditSlotRequestDto, DeleteSlotRequest } from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { ISlotRepository } from "../../common/repositories/slot-repository";
import { RepositoryFactory } from "../../common/repositories/factory";


@Produces("application/json")
@Tags("Slots")
@Path("/slot")
export class SlotController extends BaseController {

	private _slotRepository: ISlotRepository = RepositoryFactory.instance.createSlotRepository();

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@GET
	public async getSlots(@QueryParam("type") type?: string): Promise<SlotDto[]> {
    let slots = await this._slotRepository.getAvailableSlots(type);
    return slots.map(slot => new SlotDto(slot));
  }
  
  @Security("Bearer")
  @JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async createSlot(@JSONBody(CreateSlotRequestDto) request: CreateSlotRequestDto): Promise<SlotDto> {
    let slot = await this._slotRepository.createSlot(request);
    return new SlotDto(slot);
	}
  
  @Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@PATCH
	public async editSlot(@JSONBody(EditSlotRequestDto) request: EditSlotRequestDto): Promise<SlotDto> {
    let slot = await this._slotRepository.editSlot(request);
    return new SlotDto(slot);
	}
  
  @Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@DELETE
	public async deleteSlot(@JSONBody(DeleteSlotRequest) request: DeleteSlotRequest) {
    await this._slotRepository.deleteSlot(request);
  }

}