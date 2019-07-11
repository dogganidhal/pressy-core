import { Driver } from "../../model/entity/users/driver/driver";
import { Person } from "../../model/entity/users/person";
import { CreatePersonRequestDto, MobileDeviceDto, AssignDriverSlotsRequestDto } from "../../model/dto";
import { MobileDevice } from "../../model/entity/users/device";
import { DriverSlot } from "../../model/entity/users/driver/driver-slot";


export interface IDriverRepository {

  getAllDrivers(): Promise<Driver[]>;
  getDriverFromPerson(person:Person): Promise<Driver | undefined>;
  getDriverFromPersonOrFail(person:Person): Promise<Driver>;
  getDriverById(id: number): Promise<Driver | undefined>;
	getDriverByEmail(email: string): Promise<Driver | undefined>;
  getDriverByPhone(phone: string): Promise<Driver | undefined>;
  createDriver(createDriverRequest: CreatePersonRequestDto): Promise<Driver>;
  deleteDriverByEmail(email: string): Promise<void>;
	getMobileDevices(member: Driver): Promise<MobileDevice[]>;
	registerMobileDevice(driver: Driver, mobileDeviceDTO: MobileDeviceDto): Promise<MobileDevice>;
	getDriverSlots(driver: Driver): Promise<DriverSlot[]>;
	getAllDriverSlots(startDate: Date, endDate: Date): Promise<DriverSlot[]>;
	assignDriverSlots(driver: Driver, slots: AssignDriverSlotsRequestDto[]): Promise<Driver>;
  
}