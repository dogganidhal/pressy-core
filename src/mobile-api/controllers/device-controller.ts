import {GET, Path, POST, Accept, DELETE} from "typescript-rest";
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONResponse} from "../../common/annotations";
import {Security, Produces, Tags} from "typescript-rest-swagger";
import {MobileDevice} from "../../common/model/dto";
import {exception} from "../../common/errors";
import * as Return from "typescript-rest/dist/server-return";


@Produces("application/json")
@Tags("Devices")
@Accept("application/json")
@Path('/devices')
export class DeviceController extends BaseController {

 private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());

 @JSONResponse
 @Security("Bearer")
 @Authenticate(SigningCategory.MEMBER)
 @POST
 public async registerMobileDevice(request: MobileDevice) {

	const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

	if (!member)
	 throw new exception.AccountNotFoundException(this.pendingPerson.email);

	const mobileDevice = http.parseJSONBody(this.getPendingRequest().body, MobileDevice);

	await this._memberRepository.registerMobileDevice(member, mobileDevice);

	return new Return.NewResource(`/v1/member/devices`);

 }

 @Security("Bearer")
 @JSONResponse
 @Authenticate(SigningCategory.MEMBER)
 @GET
 public async getMobileDevices(): Promise<MobileDevice[]> {

	const member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

	if (!member)
	 throw new exception.AccountNotFoundException(this.pendingPerson.email);

	let mobileDevices = await this._memberRepository.getMobileDevices(member);

	return mobileDevices.map(device => {
	 return {deviceId: device.id};
	});

 }

 @Security("Bearer")
 @JSONResponse
 @Authenticate(SigningCategory.MEMBER)
 @DELETE
 public async deleteMobileDevice(request: MobileDevice) {

	let mobileDeviceDTO = http.parseJSONBody(this.getPendingRequest().body, MobileDevice);
	await this._memberRepository.deleteMobileDevice(this.pendingPerson, mobileDeviceDTO);

 }

}