import {GET, Path, POST, Accept, DELETE} from "typescript-rest";
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import {Security, Produces, Tags} from "typescript-rest-swagger";
import {MobileDeviceDto} from "../../common/model/dto";
import {exception} from "../../common/errors";
import * as Return from "typescript-rest/dist/server-return";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member/member";


@Produces("application/json")
@Tags("Devices")
@Accept("application/json")
@Path('/devices')
export class DeviceController extends BaseController {

	private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());

	@JSONEndpoint
	@Security("Bearer")
	@Authenticate(SigningCategory.MEMBER)
	@POST
	public async registerMobileDevice(@JSONBody(MobileDeviceDto) request: MobileDeviceDto) {
		await this._memberRepository.registerMobileDevice(<Member>this.pendingUser, request);
	}

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.MEMBER)
	@GET
	public async getMobileDevices(): Promise<MobileDeviceDto[]> {
		let mobileDevices = await this._memberRepository.getMobileDevices(<Member>this.pendingUser);
		return mobileDevices.map(device => {
			return {deviceId: device.id};
		});
	}

	@Security("Bearer")
	@JSONEndpoint
	@Authenticate(SigningCategory.MEMBER)
	@DELETE
	public async deleteMobileDevice(@JSONBody(MobileDeviceDto) request: MobileDeviceDto) {
		await this._memberRepository.deleteMobileDevice(this.pendingUser.person, request);
	}

}