import RandomString from "randomstring";
import {Connection} from "typeorm";
import {Database} from "../../src/common/db";
import {Member} from "../../src/common/model/entity/users/member";
import {Slot, SlotType} from "../../src/common/model/entity/slot";
import {DateUtils} from "../../src/common/utils";
import {exception} from "../../src/common/errors";
import {Address} from "../../src/common/model/entity/common/address";
import { RepositoryFactory } from "../../src/common/repositories/factory";
import { OrderType } from "../../src/common/model/entity/order";
import { IOrderRepository, IMemberRepository, IPersonRepository, ISlotRepository, IAddressRepository } from "../../src/common/repositories";


describe("OrderRepository Operations", () => {

	let connection: Connection;
	let repositoryFactory: RepositoryFactory;
	let orderRepository: IOrderRepository;
	let memberRepository: IMemberRepository;
	let personRepository: IPersonRepository;
	let slotRepository: ISlotRepository;
	let pickupSlot: Slot;
	let deliverySlot: Slot;
	let activeMember: Member;
	let inactiveMember: Member;
	let addressRepository: IAddressRepository;
	let address: Address;

	async function createResources() {
		// Create Database connection and repositories
		connection = await Database.createConnection();
		repositoryFactory = new RepositoryFactory(connection);
		orderRepository = repositoryFactory.createOrderRepository();
		memberRepository = repositoryFactory.createMemberRepository();
		personRepository = repositoryFactory.createPersonRepository();
		slotRepository = repositoryFactory.createSlotRepository();
		addressRepository = repositoryFactory.createAddressRepository();
		// Create Members
		activeMember = await memberRepository.createMember({
			firstName: "John",
			lastName: "DOE",
			email: `${RandomString.generate(15)}@email.com`,
			phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
			password: "qwerty2018"
		});
		inactiveMember = await memberRepository.createMember({
			firstName: "Inactive",
			lastName: "Member",
			email: `${RandomString.generate(15)}@email.com`,
			phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
			password: "qwerty2018"
		});

		let emailValidationCode = await personRepository.createEmailValidationCode(activeMember.person);
		let phoneValidationCode = await personRepository.createPhoneValidationCode(activeMember.person);
		activeMember.person = await personRepository.validateEmail(emailValidationCode.code);
		activeMember.person = await personRepository.validatePhone(phoneValidationCode.code);

		// Create Slots
		pickupSlot = await slotRepository.createSlot({
			startDate: DateUtils.dateByAddingTimeInterval(new Date, 3600 * 48),
			type: SlotType.STANDARD,
			availableDrivers: 5
		});
		deliverySlot = await slotRepository.createSlot({
			startDate: DateUtils.dateByAddingTimeInterval(pickupSlot.startDate, 3600 * 24),
			type: SlotType.STANDARD,
			availableDrivers: 5
		});

		address = await addressRepository.createAddress({
			name: "TEST",
			extraLine: "Somewhere in the world",
			googlePlaceId: "ChIJPZVtpz1u5kcRQyeKkuEZ2LQ"
		}, activeMember);

	}

	beforeAll(async done => {

		await createResources();
		done();

	}, 60000);

	test("Creates Order for an active member", async done => {

		expect.assertions(11);

		try {
			let order = await orderRepository.createOrder(activeMember, {
				pickupSlotId: pickupSlot.id,
				deliverySlotId: deliverySlot.id,
				addressId: address.id, type: OrderType.PRESSING
			});

			expect(order.member).toEqual(activeMember);

			expect(order.pickupSlot.type).toEqual(SlotType.STANDARD);
			expect(order.deliverySlot.type).toEqual(SlotType.STANDARD);

			expect(order.address).toEqual(order.address);
			expect(order.address.city).toEqual("Paris");
			expect(order.address.country).toEqual("France");
			expect(order.address.formattedAddress).toEqual("142 Rue Montmartre, 75002 Paris, France");
			expect(order.address.streetName).toEqual("Rue Montmartre");
			expect(order.address.streetNumber).toEqual("142");
			expect(order.address.zipCode).toEqual("75002");

			expect(order.laundryPartner).toBeUndefined();

			done();
 		} catch (error) {
			done.fail(error);
		}

	}, 60000);

	test("Throws an error when created with inactive member", async done => {

		expect.assertions(1);

		try {

			await orderRepository.createOrder(inactiveMember, {
				pickupSlotId: pickupSlot.id,
				deliverySlotId: deliverySlot.id,
				addressId: address.id, type: OrderType.PRESSING
			});
			done.fail();

		} catch (error) {

			expect(error instanceof exception.InactiveMemberException).toBeTruthy();
			done();

		}

	}, 60000);

	afterAll(() => {



	});

});