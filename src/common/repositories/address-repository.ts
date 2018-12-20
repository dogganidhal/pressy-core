import { BaseRepository } from "./base-repository";
import { Repository } from "typeorm";
import {UpdateAddressRequest, CreateAddressRequest, Address, DeleteAddressRequest} from "../model/dto";
import { GeocodeService } from "../../services/geocode-service";
import { exception } from "../errors";
import { Member } from "../model/entity/users/member/member";
import { Address as AddressEntity } from "../model/entity/common/address";


export class AddressRepository extends BaseRepository {

	private _addressRepository: Repository<AddressEntity> = this.connection.getRepository(AddressEntity);
	private _geocodeService: GeocodeService = new GeocodeService();

	public async getAddressById(id: number): Promise<AddressEntity | undefined> {
		return await this._addressRepository.findOne(id);
	}

	public async getMemberAddresses(member: Member): Promise<Address[]> {
		return await this._addressRepository.find({member: member});
	}

	public async createAddress(createAddressRequest: CreateAddressRequest, member: Member): Promise<AddressEntity> {

		let addressDTO: Address;

		if (createAddressRequest.googlePlaceId)
			addressDTO = await this._geocodeService.getAddressWithPlaceId(createAddressRequest.googlePlaceId);
		else if (createAddressRequest.coordinates)
			addressDTO = await this._geocodeService.getAddressWithCoordinates(createAddressRequest.coordinates);
		else
			throw new exception.CannotCreateAddressException;

		let address = AddressEntity.create({
			...addressDTO,
			name: createAddressRequest.name,
			extraLine: createAddressRequest.extraLine
		});

		address.member = member;
		address = await this._addressRepository.save(address);

		return address;

	}

	public async duplicateAddress(address: Address): Promise<AddressEntity> {
		return await this._addressRepository.save(AddressEntity.create({...address, id: undefined}));
	}

	public async updateAddress(request: UpdateAddressRequest, member: Member) {

		let address = await this._addressRepository.findOne(request.addressId);

		if (!address)
			throw new exception.AddressNotFoundException(request.addressId);

		if (!address.member || address.member.id != member.id)
			throw new exception.CannotUpdateAddressException(request.addressId);

		let newAddressDTO = null;

		if (request.addressDetails.googlePlaceId)
			newAddressDTO = await this._geocodeService.getAddressWithPlaceId(request.addressDetails.googlePlaceId);
		else if (request.addressDetails.coordinates)
			newAddressDTO = await this._geocodeService.getAddressWithCoordinates(request.addressDetails.coordinates);

		if (newAddressDTO != null)
			address = AddressEntity.create({
				...newAddressDTO,
				id: address.id
			});

		address.name = request.addressDetails.name;
		address.extraLine = request.addressDetails.extraLine;

		await this._addressRepository.save(address);

	}

	public async deleteAddress(request: DeleteAddressRequest, member: Member) {

		let address = await this._addressRepository.findOne(request.addressId, {relations: ["member"]});

		if (!address)
			throw new exception.AddressNotFoundException(request.addressId);

		if (!address.member || address.member.id != member.id)
			throw new exception.CannotDeleteAddressException(request.addressId);

		await this._addressRepository.delete({id: request.addressId});
	}

}