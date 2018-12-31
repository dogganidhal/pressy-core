import {Connection} from 'typeorm';
import { MemberRepository } from '../../src/common/repositories/users/member-repository';
import RandomString from "randomstring";
import bcrypt from "bcrypt";
import {Member} from "../../src/common/model/entity/users/member/member";
import {Person} from "../../src/common/model/entity/users/person";
import {Database} from "../../src/common/db";
import {PersonRepository} from "../../src/common/repositories/users/person-repository";
import {exception} from "../../src/common/errors";
import { CreatePersonRequestDto } from '../../src/common/model/dto';


describe("MemberRepository Write/Delete Operations Tests", () => {

  let connection: Connection;
  let memberRepository: MemberRepository;

	const testMember = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		phone: RandomString.generate({length: 10, charset: "numeric"}),
    password: "qwerty2018"
	} as CreatePersonRequestDto;
	const testMember2 = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		phone: RandomString.generate({length: 10, charset: "numeric"}),
		password: "qwerty2018"
	} as CreatePersonRequestDto;

  beforeAll(async done => {
    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);
    done();
  });

  test("Creates a new person", async done => {

    expect.assertions(5);

    const __dbPersonRepository = connection.getRepository(Person);
    const __dbMemberRepository = connection.getRepository(Member);

    await memberRepository.createMember(testMember);

    const person = await __dbPersonRepository.findOne({email: testMember.email}) || done.fail();
    const member = await __dbMemberRepository.findOne({person: person}, {relations: ["person"]}) || done.fail();

    expect(member.person.email).toEqual(testMember.email);
	  expect(member.person.phone).toEqual(testMember.phone);
	  expect(member.person.firstName).toEqual(testMember.firstName);
	  expect(member.person.lastName).toEqual(testMember.lastName);
	  expect(bcrypt.compareSync(testMember.password, member.person.passwordHash)).toBeTruthy();

	  done();

  });

	test("Deletes Member With Email", async done => {

	  let createdMember = await memberRepository.createMember(testMember2);

	  expect(createdMember).not.toBeUndefined();
	  expect(createdMember.person).not.toBeUndefined();

	  await memberRepository.deleteMemberByEmail(testMember2.email);

	  let deletedMember = await memberRepository.getMemberByEmail(testMember2.email);

	  expect(deletedMember).toBeUndefined();

		done();

	});

  afterAll(async done => {
    await connection.close();
    done();
  })

});


describe("MemberRepository Read Operations Tests", () => {

  let connection: Connection;
  let memberRepository: MemberRepository;
	let personRepository: PersonRepository;
  const memberDTO: CreatePersonRequestDto = {
    firstName: RandomString.generate(10),
    lastName: RandomString.generate(10),
    password: "qwerty2018",
    phone: RandomString.generate({length: 10, charset: "numeric"}),
    email : `${RandomString.generate(10)}@email.com`
  };

  beforeAll(async (done) => {
    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);
    personRepository = new PersonRepository(connection);
    await memberRepository.createMember(memberDTO);
    done();
  }, 60000);

  test("Gets an existing person from database with a correct Email", async () => {
    expect.assertions(5);
    try {
      const member = await memberRepository.getMemberByEmail(memberDTO.email);
      expect(member).not.toBeUndefined();
      expect(member!.person.firstName).toEqual(memberDTO.firstName);
      expect(member!.person.lastName).toEqual(memberDTO.lastName);
      expect(member!.person.phone).toEqual(memberDTO.phone);
      expect(member!.person.email).toEqual(memberDTO.email);
    } catch (error) {
      fail(error)
    }
  }, 60000);

  test("Returns undefined from getMemberByEmail when no person with given email is found", async () => {
    expect.assertions(1);
    try {
      const member = await memberRepository.getMemberByEmail(`does.not.exist@not.found`);
      expect(member).toBeUndefined();
    } catch (error) {
      fail(error)
    }
  }, 60000);

  test("Gets an existing person from database with a correct Phone", async () => {
    expect.assertions(5);
    try {
      const member = await memberRepository.getMemberByPhone(memberDTO.phone);
      expect(member).not.toBeUndefined();
      expect(member!.person.firstName).toEqual(memberDTO.firstName);
      expect(member!.person.lastName).toEqual(memberDTO.lastName);
      expect(member!.person.phone).toEqual(memberDTO.phone);
      expect(member!.person.email).toEqual(memberDTO.email);
    } catch (error) {
      fail(error)
    }
  }, 60000);

  test("Returns undefined from getMemberByPhone when no person with given phone is found", async () => {
    expect.assertions(1);
    try {
      const member = await memberRepository.getMemberByEmail(`00000000000`);
      expect(member).toBeUndefined();
    } catch (error) {
      fail(error)
    }
  }, 60000);

  test("Updates the member info on the person Table", async done => {

  	expect.assertions(2);

  	let memberToUpdate = await memberRepository.createMember({
		  firstName: RandomString.generate(10),
		  lastName: RandomString.generate(10),
		  email: `${RandomString.generate(10)}@mail.com`,
		  phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
		  password: "qwerty2018",
	  });

  	await personRepository.updatePersonInfo(memberToUpdate.person, {
  		firstName: "John",
		  lastName: "DOE"
	  });

  	let updatedMember = await memberRepository.getMemberByEmail(memberToUpdate.person.email) || done.fail();

  	expect(updatedMember.person.firstName).toEqual("John");
	  expect(updatedMember.person.lastName).toEqual("DOE");

	  done();


  }, 60000);

	test("Throws an error when new email already exists", async done => {

		expect.assertions(1);

		let duplicateEmail = `${RandomString.generate(10)}@mail.com`;

		await memberRepository.createMember({
			firstName: RandomString.generate(10),
			lastName: RandomString.generate(10),
			email: duplicateEmail,
			phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
			password: "qwerty2018",
		});
		let memberToUpdate = await memberRepository.createMember({
			firstName: RandomString.generate(10),
			lastName: RandomString.generate(10),
			email: `${RandomString.generate(10)}@mail.com`,
			phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
			password: "qwerty2018",
		});

		try {
			await personRepository.updatePersonInfo(memberToUpdate.person, {
				email: duplicateEmail
			});
			done.fail();
		} catch (error) {
			expect(error instanceof exception.EmailAlreadyExistsException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Throws an error when new phone already exists", async done => {

		expect.assertions(1);

		let duplicatePhone = RandomString.generate({length: 10, charset: "numeric"});

		await memberRepository.createMember({
			firstName: RandomString.generate(10),
			lastName: RandomString.generate(10),
			email: `${RandomString.generate(10)}@mail.com`,
			phone: duplicatePhone,
			password: "qwerty2018",
		});
		let memberToUpdate = await memberRepository.createMember({
			firstName: RandomString.generate(10),
			lastName: RandomString.generate(10),
			email: `${RandomString.generate(10)}@mail.com`,
			phone: `${RandomString.generate({length: 10, charset: "numeric"})}`,
			password: "qwerty2018",
		});

		try {
			await personRepository.updatePersonInfo(memberToUpdate.person, {
				phone: duplicatePhone
			});
			done.fail();
		} catch (error) {
			expect(error instanceof exception.PhoneAlreadyExists).toBeTruthy();
			done();
		}


	}, 60000);

  afterAll(async (done) => {
    await memberRepository.deleteMemberByEmail(memberDTO.email);
    await connection.close();
    done();
  }, 60000);
  
});
