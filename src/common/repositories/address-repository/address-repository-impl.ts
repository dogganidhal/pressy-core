import { BaseRepository } from "../base-repository";
import { Repository } from "typeorm";
import {UpdateAddressRequestDto, CreateAddressRequestDto, AddressDto, DeleteAddressRequestDto} from "../../model/dto";
import { GeocodeService } from "../../../services/geocode-service";
import { exception } from "../../errors";
import { Member } from "../../model/entity/users/member";
import { Address as AddressEntity } from "../../model/entity/common/address";
import { IAddressRepository } from ".";


export class AddressRepositoryImpl extends BaseRepository implements IAddressRepository {

	private _addressRepository: Repository<AddressEntity> = this.connection.getRepository(AddressEntity);
	private _geocodeService: GeocodeService = new GeocodeService();

	public async getAddressById(id: number): Promise<AddressEntity | undefined> {
		return await this._addressRepository.findOne(id);
	}

	public async getMemberAddresses(member: Member): Promise<AddressDto[]> {
		return await this._addressRepository.find({member: member});
	}

	public async createAddress(createAddressRequest: CreateAddressRequestDto, member?: Member): Promise<AddressEntity> {

		let addressDTO: AddressDto;

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

	public async duplicateAddress(address: AddressDto): Promise<AddressEntity> {
		return await this._addressRepository.save(AddressEntity.create({...address, id: undefined}));
	}

	public async updateAddress(request: UpdateAddressRequestDto, member: Member) {

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

	public async deleteAddress(addressId: number, member: Member) {

		let address = await this._addressRepository.findOne(addressId, {relations: ["member"]});

		if (!address)
			throw new exception.AddressNotFoundException(addressId);

		if (!address.member || address.member.id != member.id)
			throw new exception.CannotDeleteAddressException(addressId);

		await this._addressRepository.delete({id: addressId});
	}

}