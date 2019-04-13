import {BaseRepository} from "../base-repository";
import {ILaundryRepository} from "./index";
import {Laundrer} from "../../model/entity/users/laundry/laundrer";
import {Repository} from "typeorm";
import {Person} from "../../model/entity/users/person";
import {CreatePersonRequestDto} from "../../model/dto";
import {LaundryPartner} from "../../model/entity/users/laundry";
import {exception} from "../../errors";


export class LaundryRepositoryImpl extends BaseRepository implements ILaundryRepository {

	private _personRepository: Repository<Person> = this.connection.getRepository(Person);
	private _laundrerRepository: Repository<Laundrer> = this.connection.getRepository(Laundrer);
	private _laundryPartnerRepository: Repository<LaundryPartner> = this.connection.getRepository(LaundryPartner);

	public async getLaundrerByEmail(email: string): Promise<Laundrer | undefined> {

		let person = await this._personRepository.findOne({email: email});

		if (!person)
			return undefined;

		return await this._laundrerRepository.findOne({person: person}, {relations: ["person"]});

	}

	public async getLaundrerById(id: number): Promise<Laundrer | undefined> {
		return this._laundrerRepository.findOne(id, {
			relations: ["person", "laundryPartner"]
		});
	}

	public async createLaundrer(request: CreatePersonRequestDto, laundryPartnerId: number): Promise<Laundrer> {
		
		let laundryPartner = await this._laundryPartnerRepository.findOne(laundryPartnerId);
		
		if (!laundryPartner)
			throw new exception.LaundryPartnerNotFound(laundryPartnerId);

		let laundrer = Laundrer.create(request, laundryPartner);

		await this._personRepository.insert(laundrer.person);
		await this._laundrerRepository.insert(laundrer);

		return laundrer;

	}

}