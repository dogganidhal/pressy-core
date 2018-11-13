import Randomstring from 'randomstring';
import request from "supertest";
import { Connection } from 'typeorm';
import { API } from "../../src/api";
import { MemberRepository } from '../../src/common/repositories/member-repository';
import {APIError} from "../../src/api/model/api-error";
import {Database} from "../../src/common/db";
import {member} from "../../src/common/model/dto";

describe("Testing MemberController Endpoints =>", () => {

  let connection: Connection;
  let memberRepository: MemberRepository;
  const api: API = new API;
  const memberDTO: member.CreateMemberRequest = {
    firstName: Randomstring.generate(10),
    lastName: Randomstring.generate(10),
    email: `${Randomstring.generate(10)}@test.com`,
    phone: Randomstring.generate({length: 10, charset: "numeric"}),
    password: Randomstring.generate(6)
  };
	const duplicateMemberDTO = {
		firstName: Randomstring.generate(10),
		lastName: Randomstring.generate(10),
		email: `${Randomstring.generate(10)}@test.com`,
		phone: Randomstring.generate({length: 10, charset: "numeric"}),
		password: Randomstring.generate(6)
	} as member.CreateMemberRequest;

  beforeAll(async done => {
    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);
	  await memberRepository.createMember(duplicateMemberDTO);
    done();
  }, 60000);

  it("Creates a new person with correct data", async done => {

    expect.assertions(4);

    return request(api.getApp())
      .post("/api/v1/person")
      .set("Content-Type", "application/json")
      .send(memberDTO)
	    .expect(200)
	    .then(response => {
		    const member: member.CreateMemberRequest = response.body;

		    expect(member.firstName).toEqual(memberDTO.firstName);
		    expect(member.lastName).toEqual(memberDTO.lastName);
		    expect(member.email).toEqual(memberDTO.email);
		    expect(member.phone).toEqual(memberDTO.phone);

		    done();
	    })
	    .catch(error => {
		    done.fail(error);
	    });

  }, 60000);

	it("Returns an error when the introduced email exists already", async done => {

		expect.assertions(2);

		return request(api.getApp())
			.post("/api/v1/person")
			.set("Content-Type", "application/json")
			.send(duplicateMemberDTO)
			.expect(400)
			.then(async response => {

				const error: APIError = response.body;
			  expect(error.statusCode).toEqual(400);
			  expect(error.message.length).toBeGreaterThan(0);

			  done();

      })
			.catch(async error => {
				console.warn(error);
				fail(error);
				done();
			});

	}, 60000);

  afterAll(async done => {
	  await memberRepository.deleteMemberByEmail(duplicateMemberDTO.email);
    await memberRepository.deleteMemberByEmail(memberDTO.email);
    await connection.close();
    done();
  }, 60000);

});