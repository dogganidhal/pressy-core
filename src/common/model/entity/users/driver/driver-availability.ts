import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Driver} from "./driver";


export interface IDriverAvailability {
	startDate: Date;
	endDate: Date;
	driver: Driver;
}


@Entity()
export class DriverAvailability {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column({nullable: false})
	public startDate: Date;

	@Column({nullable: false})
	public endDate: Date;

	@ManyToOne(type => Driver, driver => driver.availabilities)
	@JoinColumn()
	public driver: Driver;

	public static create(availability: IDriverAvailability): DriverAvailability {

		let driverAvailability = new DriverAvailability;

		driverAvailability.startDate = availability.startDate;
		driverAvailability.endDate = availability.endDate;
		driverAvailability.driver = availability.driver;

		return driverAvailability;

	}


}