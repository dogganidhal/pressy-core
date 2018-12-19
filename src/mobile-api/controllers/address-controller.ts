import {GET, PATCH, Path, POST, Accept, DELETE} from "typescript-rest";
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { InternalServerError } from "typescript-rest/dist/server-errors";
import { Security, Produces, Tags, Response } from "typescript-rest-swagger";
import { AddressRepository } from "../../common/repositories/address-repository";
import {Address, UpdateAddressRequest, CreateAddressRequest, DeleteAddressRequest} from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member/member";

@Produces("application/json")
@Tags("Addresses")
@Accept("application/json")
@Path('/addressId')
export class AddressController extends BaseController {

  private _addressRepository: AddressRepository = new AddressRepository(Database.getConnection());

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getMemberAddresses(): Promise<Address[]> {
    return this._addressRepository.getMemberAddresses(<Member>this.pendingUser);
  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberAddress(@JSONBody(UpdateAddressRequest) request: UpdateAddressRequest) {
    await this._addressRepository.updateAddress(request, <Member>this.pendingUser);
  }

  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createAddress(@JSONBody(CreateAddressRequest) request: CreateAddressRequest): Promise<Address> {
    let addressEntity = await this._addressRepository.createAddress(request, <Member>this.pendingUser);
    return new Address(addressEntity);
  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @DELETE
  public async deleteAddress(@JSONBody(DeleteAddressRequest) request: DeleteAddressRequest) {
    await this._addressRepository.deleteAddress(request, <Member>this.pendingUser);
  }

}