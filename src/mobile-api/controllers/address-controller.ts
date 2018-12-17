import {GET, PATCH, Path, POST, Accept} from "typescript-rest";
import {MemberRepository} from '../../common/repositories/users/member-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Database} from "../../common/db";
import {SigningCategory} from "../../services/crypto";
import {http} from "../../common/utils/http";
import {Authenticate, JSONResponse} from "../../common/annotations";
import { InternalServerError } from "typescript-rest/dist/server-errors";
import { Security, Produces, Tags, Response } from "typescript-rest-swagger";
import { AddressRepository } from "../../common/repositories/address-repository";
import { Address, UpdateAddressRequest, CreateAddressRequest } from "../../common/model/dto";

@Produces("application/json")
@Tags("Address")
@Accept("application/json")
@Path('/address')
export class AddressController extends BaseController {

  private _memberRepository: MemberRepository = new MemberRepository(Database.getConnection());
  private _addressRepository: AddressRepository = new AddressRepository(Database.getConnection());

  @Security("Bearer")
  @JSONResponse
  @Authenticate(SigningCategory.MEMBER)
  @GET
  public async getMemberAddresses(): Promise<Address[]> {

    let member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
      throw new InternalServerError;

    return this._addressRepository.getMemberAddresses(member);

  }

  @Response<void>(http.HttpStatus.HTTP_STATUS_ACCEPTED)
  @Security("Bearer")
  @JSONResponse
  @Authenticate(SigningCategory.MEMBER)
  @PATCH
  public async updateMemberAddress(request: UpdateAddressRequest) {

    let updateRequest = http.parseJSONBody(this.getPendingRequest().body, UpdateAddressRequest);
    await this._addressRepository.updateAddress(updateRequest);

  }

  @JSONResponse
  @Security("Bearer")
  @Authenticate(SigningCategory.MEMBER)
  @POST
  public async createAddress(request: CreateAddressRequest): Promise<Address> {

    let createAddressRequest = http.parseJSONBody(this.getPendingRequest().body, CreateAddressRequest);
    let member = await this._memberRepository.getMemberFromPerson(this.pendingPerson);

    if (!member)
      throw new InternalServerError;
    
    return await this._addressRepository.createAddress(createAddressRequest, member);

  }

}