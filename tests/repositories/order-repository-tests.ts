import RandomString from "randomstring";
import {Connection} from "typeorm";
import {OrderRepository} from "../../src/common/repositories/order/order-repository";
import {Database} from "../../src/common/db";
import {MemberRepository} from "../../src/common/repositories/users/member-repository";
import {Member} from "../../src/common/model/entity/users/member/member";
import {PersonRepository} from "../../src/common/repositories/users/person-repository";
import {Slot, SlotType} from "../../src/common/model/entity/slot";
import {SlotRepository} from "../../src/common/repositories/slot-repository";
import {DateUtils} from "../../src/common/utils";
import {OrderStatus} from "../../src/common/model/entity/order";
import {exception} from "../../src/common/errors";
import {Address} from "../../src/common/model/entity/common/address";
import {AddressRepository} from "../../src/common/repositories/address-repository";


describe("OrderRepository Operations", () => {

	let connection: Connection;
	let orderRepository: OrderRepository;
	let memberRepository: MemberRepository;
	let personRepository: PersonRepository;
	let slotRepository: SlotRepository;
	let pickupSlot: Slot;
	let deliverySlot: Slot;
	let activeMember: Member;
	let inactiveMember: Member;
	let addressRepository: AddressRepository;
	let address: Address;

	async function createResources() {
		// Create Database connection and repositories
		connection = await Database.createConnection();
		orderRepository = new OrderRepository(connection);
		memberRepository = new MemberRepository(connection);
		personRepository = new PersonRepository(connection);
		slotRepository = new SlotRepository(connection);
		addressRepository = new AddressRepository(connection);
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
			type: SlotType.GOLD,
			availableDrivers: 5
		});
		deliverySlot = await slotRepository.createSlot({
			startDate: DateUtils.dateByAddingTimeInterval(pickupSlot.startDate, 3600 * 24),
			type: SlotType.GOLD,
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

		expect.assertions(13);

		try {
			let order = await orderRepository.createOrder(activeMember, {
				pickupSlotId: pickupSlot.id,
				deliverySlotId: deliverySlot.id,
				addressId: address.id
			});

			expect(order.status).toEqual(OrderStatus.UNVALIDATED);

			expect(order.driver).toBeUndefined();
			expect(order.member).toEqual(activeMember);

			expect(order.pickupSlot.type).toEqual(SlotType.GOLD);
			expect(order.deliverySlot.type).toEqual(SlotType.GOLD);

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
				addressId: address.id,
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