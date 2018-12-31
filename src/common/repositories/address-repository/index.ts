import { Address } from "../../model/entity/common/address";
import { AddressDto, CreateAddressRequestDto, UpdateAddressRequestDto, DeleteAddressRequestDto } from "../../model/dto";
import { Member } from "../../model/entity/users/member/member";


export interface IAddressRepository {
  
  getAddressById(id: number): Promise<Address | undefined>;
  getMemberAddresses(member: Member): Promise<AddressDto[]>;
  createAddress(createAddressRequest: CreateAddressRequestDto, member: Member): Promise<Address>;
  duplicateAddress(address: AddressDto): Promise<Address>;
	updateAddress(request: UpdateAddressRequestDto, member: Member): Promise<void>;
  deleteAddress(request: DeleteAddressRequestDto, member: Member): Promise<void>;
  
}