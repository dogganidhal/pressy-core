import { Connection, createConnection } from 'typeorm';
import Randomstring from 'randomstring';
import { MemberRegistrationDTO, MemberInfoDTO } from './../../src/common/model/dto/member';
import { LoginResponseDTO } from '../../src/common/model/dto/member';
import API from "../../src/api";
import request from "supertest";
import { JSONSerialization } from '../../src/common/utils/json-serialization';
import { MemberRepository } from '../../src/common/repositories/member-repository';

describe("Testing MemberController Endpoints", () => {

  let connection: Connection;
  let memberRepository: MemberRepository;
  const api: API = new API;
  const memberDTO: MemberRegistrationDTO = {
    firstName: Randomstring.generate(10),
    lastName: Randomstring.generate(10),
    email: `${Randomstring.generate(10)}@test.com`,
    phone: Randomstring.generate({length: 10, charset: "numeric"}),
    password: Randomstring.generate(6)
  };

  beforeAll(async done => {
    connection = await createConnection();
    memberRepository = new MemberRepository(connection);
    done();
  }, 60000);

  it("Returns access credentials when correct user and password were introduced", async done => {

    expect.assertions(5);

    request(api.getApp())
      .post("/api/v1/member")
      .set("Content-Type", "application/json")
      .send(memberDTO)
      .expect(200, (error, response) => {

        expect(error).toBeNull();

        const member: MemberRegistrationDTO = JSONSerialization.deserializeObject(response.body, MemberRegistrationDTO);

        expect(member.firstName).toEqual(memberDTO.firstName);
        expect(member.lastName).toEqual(memberDTO.lastName);
        expect(member.email).toEqual(memberDTO.email);
        expect(member.phone).toEqual(memberDTO.phone);

        done();

      });

  }, 60000);

  afterAll(async done => {
    await memberRepository.deleteMemberByEmail(memberDTO.email);
    await connection.close();
    done();
  }, 60000);

});