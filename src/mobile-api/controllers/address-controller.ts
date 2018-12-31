import {GET, PATCH, Path, POST, Accept, DELETE} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONEndpoint} from "../../common/annotations";
import { Security, Produces, Tags, Response } from "typescript-rest-swagger";
import {AddressDto, UpdateAddressRequestDto, CreateAddressRequestDto, DeleteAddressRequestDto} from "../../common/model/dto";
import {JSONBody} from "../../common/annotations/json-body";
import {Member} from "../../common/model/entity/users/member/member";
import { IAddressRepository } from "../../common/repositories/address-repository";
import { RepositoryFactory } from "../../common/repositories/factory";

@Produces("application/json")
@Tags("Addresses")
@Accept("application/json")
@Path('/addressId')
export class AddressController extends BaseController {

  private _addressRepository: IAddressRepository = RepositoryFactory.instance.createAddressRepository();

  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getMemberAddresses(): Promise<AddressDto[]> {
    return this._addressRepository.getMemberAddresses(<Member>this.pendingUser);
  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @Security("Bearer")
  @JSONEndpoint
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberAddress(@JSONBody(UpdateAddressRequestDto) request: UpdateAddressRequestDto) {
    await this._addressRepository.updateAddress(request, <Member>this.pendingUser);
  }

  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createAddress(@JSONBody(CreateAddressRequestDto) request: CreateAddressRequestDto): Promise<AddressDto> {
    let addressEntity = await this._addressRepository.createAddress(request, <Member>this.pendingUser);
    return new AddressDto(addressEntity);
  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @JSONEndpoint
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @DELETE
  public async deleteAddress(@JSONBody(DeleteAddressRequestDto) request: DeleteAddressRequestDto) {
    await this._addressRepository.deleteAddress(request, <Member>this.pendingUser);
  }

}