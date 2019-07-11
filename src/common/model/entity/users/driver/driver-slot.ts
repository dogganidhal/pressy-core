import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Driver} from "./driver";


export interface IDriverSlot {
	startDate: Date;
	endDate: Date;
}


@Entity()
export class DriverSlot {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column({nullable: false})
	public startDate: Date;

	@Column({nullable: false})
	public endDate: Date;

	@ManyToMany(type => Driver, driver => driver.slots)
	@JoinTable()
	public driver: Driver;

	public static create(driverSlot: IDriverSlot): DriverSlot {

		let driverSlotEntity = new DriverSlot;

		driverSlotEntity.startDate = driverSlot.startDate;
		driverSlotEntity.endDate = driverSlot.endDate;

		return driverSlotEntity;

	}

}
