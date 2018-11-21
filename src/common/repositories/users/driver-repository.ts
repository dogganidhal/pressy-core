import {MobileDevice} from '../../model/entity/users/device';
import {Repository} from "typeorm";
import {exception} from "../../errors";
import {ActivationCode, Person} from '../../model/entity/users/person';
import {BaseRepository} from '../base-repository';
import * as DTO from "../../model/dto/index";
import {Driver} from "../../model/entity/users/driver/driver";
import {DriverSlot} from "../../model/entity/users/driver/driver-slot";


export class DriverRepository extends BaseRepository {

	private _driverRepository: Repository<Driver> = this.connection.getRepository(Driver);
	private _mobileDeviceRepository: Repository<MobileDevice> = this.connection.getRepository(MobileDevice);
	private _personRepository: Repository<Person> = this.connection.getRepository(Person);
	private _personActivationCodeRepository: Repository<ActivationCode> = this.connection.getRepository(ActivationCode);
	private _driverSlotRepository: Repository<DriverSlot> = this.connection.getRepository(DriverSlot);

	public async getAllDrivers(): Promise<Driver[]> {
		return (await this._driverRepository).find();
	}

	public async getDriverFromPerson(person:Person): Promise<Driver | undefined> {
		return await this._driverRepository.findOne({person: person}, {relations: ["person"]});
	}

	public async getDriverFromPersonOrFail(person:Person): Promise<Driver> {
		return await this._driverRepository.findOneOrFail({person: person}, {relations: ["person"]});
	}

	public async getDriverById(id: number): Promise<Driver | undefined> {
		return this._driverRepository.findOne(id, {relations: ["person"]});
	}

	public async getDriverByEmail(email: string): Promise<Driver | undefined> {

		const person = await this._personRepository.findOne({email: email});

		if (!person)
			return undefined;

		return await this._driverRepository.findOne({person: person}, {relations: ["person"]});

	}

	public async getDriverByPhone(phone: string): Promise<Driver | undefined> {

		const person = await this._personRepository.findOne({phone: phone});

		if (!person)
			return undefined;

		return await this._driverRepository.findOne({person: {id: person.id}}, {relations: ["person"]});

	}

	public async createDriver(createDriverRequest: DTO.person.CreatePersonRequest): Promise<Driver> {

		const { email, phone } = createDriverRequest;

		if (!email)
			throw new exception.MissingFieldsException("email");

		if (!phone)
			throw new exception.MissingFieldsException("phone");

		const memberWithSameEmail = await this.getDriverByEmail(email);
		if (memberWithSameEmail)
			throw new exception.EmailAlreadyExistsException(email);

		const memberWithSamePhone = await this.getDriverByPhone(phone);
		if (memberWithSamePhone)
			throw new exception.PhoneAlreadyExists(phone);

		const newDriver = Driver.create(createDriverRequest);

		await this._personRepository.insert(newDriver.person);
		await this._driverRepository.insert(newDriver);

		return newDriver;

	}

	public async deleteDriverByEmail(email: string): Promise<void> {

		const person = await this._personRepository.findOne({email: email});

		if (!person)
			return;

		const personActivationCode = await this._personActivationCodeRepository.findOne({person: person});
		const driver = await this._driverRepository.findOne({person: person});

		if (personActivationCode)
			await this._personActivationCodeRepository.delete(personActivationCode);

		if (driver)
			await this._driverRepository.delete(driver);

		await this._personRepository.delete(person);

	}

	public async getMobileDevices(member: Driver): Promise<MobileDevice[]> {

		return this._mobileDeviceRepository.find({person: member});

	}

	public async registerMobileDevice(driver: Driver, mobileDeviceDTO: DTO.person.MobileDevice): Promise<MobileDevice> {

		const device = MobileDevice.create(driver.person, mobileDeviceDTO.deviceId);
		await this._mobileDeviceRepository.insert(device);
		return device;

	}

	public async assignDriverSlots(driver: Driver, slots: DTO.driver.AssignDriverSlotsRequest[]): Promise<Driver> {

		let driverSlots: DriverSlot[] = [];

		slots.map(async slot => {

			let driverSlot = await this._driverSlotRepository.findOne(slot.driverSlotId);

			if (driverSlot)
				driverSlots.push(driverSlot);
			else
				throw new exception.DriverSlotNotFoundException(slot.driverSlotId);

		});

		driver.slots = driverSlots;

		await this._driverRepository.save(driver);

		return driver;

	}

}