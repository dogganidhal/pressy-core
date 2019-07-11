import {Laundrer} from "../../model/entity/users/laundry/laundrer";
import {CreatePersonRequestDto} from "../../model/dto";


export interface ILaundryRepository {
	getLaundrerByEmail(email: string): Promise<Laundrer | undefined>;
	getLaundrerById(id: number): Promise<Laundrer | undefined>;
	createLaundrer(request: CreatePersonRequestDto, laundryPartnerId: number): Promise<Laundrer>;
}