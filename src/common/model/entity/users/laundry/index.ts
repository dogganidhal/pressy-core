import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column} from "typeorm";
import {Address} from "../../common/address";

export interface ILaundryPartner {
	name?: string;
	address: Address;
}

@Entity()
export class LaundryPartner {

	@PrimaryGeneratedColumn()
	public id: number;

	@Column({nullable: true})
	public name?: string;

	@OneToOne(type => Address)
	public address: Address;

	public static create(laundryPartner: ILaundryPartner): LaundryPartner{

		let laundryPartnerEntity = new LaundryPartner;

		laundryPartnerEntity.address = laundryPartner.address;
		laundryPartnerEntity.name = laundryPartner.name;

		return laundryPartnerEntity;

	}

}