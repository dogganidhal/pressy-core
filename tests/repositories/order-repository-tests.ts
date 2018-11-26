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

	async function createResources() {
		// Create Database connection and repositories
		connection = await Database.createConnection();
		orderRepository = new OrderRepository(connection);
		memberRepository = new MemberRepository(connection);
		personRepository = new PersonRepository(connection);
		slotRepository = new SlotRepository(connection);
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

		let activationCode = await personRepository.createActivationCode(activeMember.person);
		await personRepository.activatePerson(activeMember.person, activationCode);

		// Create Slots
		pickupSlot = await slotRepository.createSlot({
			startDate: DateUtils.dateByAddingTimeInterval(new Date, 3600 * 48),
			type: SlotType.GOLD
		});
		deliverySlot = await slotRepository.createSlot({
			startDate: DateUtils.dateByAddingTimeInterval(pickupSlot.startDate, 3600 * 24),
			type: SlotType.GOLD
		});

	}

	beforeAll(async done => {

		await createResources();
		done();

	});

	test("Creates Order for an active member", async done => {

		expect.assertions(14);

		let order = await orderRepository.createOrder(activeMember, {
			pickupSlotId: pickupSlot.id,
			deliverySlotId: deliverySlot.id,
			pickupAddress: {
				googlePlaceId: "ChIJPZVtpz1u5kcRQyeKkuEZ2LQ"
			},
			elements: []
		});

		expect(order.elements.length).toEqual(0);
		expect(order.status).toEqual(OrderStatus.UNVALIDATED);

		expect(order.driver).toBeUndefined();
		expect(order.member).toEqual(activeMember);

		expect(order.pickupSlot.type).toEqual(SlotType.GOLD);
		expect(order.deliverySlot.type).toEqual(SlotType.GOLD);

		expect(order.pickupAddress).toEqual(order.deliveryAddress);
		expect(order.pickupAddress.city).toEqual("Paris");
		expect(order.pickupAddress.country).toEqual("France");
		expect(order.pickupAddress.formattedAddress).toEqual("142 Rue Montmartre, 75002 Paris, France");
		expect(order.pickupAddress.streetName).toEqual("Rue Montmartre");
		expect(order.pickupAddress.streetNumber).toEqual("142");
		expect(order.pickupAddress.zipCode).toEqual("75002");

		expect(order.laundryPartner).toBeUndefined();

		done();

	}, 60000);

	test("Throws an error when created with unactive member", async done => {

		expect.assertions(1);

		try {

			await orderRepository.createOrder(inactiveMember, {
				pickupSlotId: pickupSlot.id,
				deliverySlotId: deliverySlot.id,
				pickupAddress: {
					googlePlaceId: "ChIJPZVtpz1u5kcRQyeKkuEZ2LQ"
				},
				elements: []
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