import { Connection } from 'typeorm';
import { MemberRepository } from './../../src/common/repositories/member-repository';
import { MemberRegistrationDTO } from "../../src/common/model/dto/member";
import Randomstring from "randomstring";
import { createConnection } from 'typeorm';


describe("MemberRepository operations test suite", () => {

  var connection: Connection;
  var memberRepository: MemberRepository;
  const memberDTO: MemberRegistrationDTO = {
    firstName: Randomstring.generate(10),
    lastName: Randomstring.generate(10),
    password: Randomstring.generate(10),
    phone: Randomstring.generate({length: 10, charset: "numeric"}),
    email : `${Randomstring.generate(10)}@gmail.com`
  };

  beforeAll(async (done) => {
    connection = await createConnection();
    console.warn(connection.options);
    memberRepository = new MemberRepository(connection);
    await memberRepository.createMember(memberDTO);
    done();
  });

  test("Gets an existing member from database with a correct Email", async () => {
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
  });

  test("Returns undefined from getMemberByEmail when no member with given email is found", async () => {
    expect.assertions(1);
    try {
      const member = await memberRepository.getMemberByEmail(`does.not.exist@not.found`);
      expect(member).toBeUndefined();
    } catch (error) {
      fail(error)
    }
  });

  test("Gets an existing member from database with a correct Phone", async () => {
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
  });

  test("Returns undefined from getMemberByPhone when no member with given phone is found", async () => {
    expect.assertions(1);
    try {
      const member = await memberRepository.getMemberByEmail(`00000000000`);
      expect(member).toBeUndefined();
    } catch (error) {
      fail(error)
    }
  });

  afterAll(async (done) => {
    await memberRepository.deleteMemberByEmail(memberDTO.email);
    connection.close();
    done();
  });
  
});
