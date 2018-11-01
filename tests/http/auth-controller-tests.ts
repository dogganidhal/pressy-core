import { createConnection } from 'typeorm';
import { MemberRepository } from '../../src/common/repositories/member-repository';
import { Connection } from 'typeorm';
import { MemberRegistrationDTO } from '../../src/common/model/dto/member';
import { LoginResponseDTO } from '../../src/common/model/dto/member';
import { API } from "../../src/api";
import request from "supertest";
import { JSONSerialization } from '../../src/common/utils/json-serialization';
import {APIError} from "../../src/api/model/api-error";
import RandomString from "randomstring";

describe("Testing Authentication Endpoints", () => {

	let connection: Connection;
	let memberRepository: MemberRepository;
	const api: API = new API;
	const memberDTO: MemberRegistrationDTO = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		password: "test",
		phone: RandomString.generate({length: 10, charset: "numeric"}),
	};

  beforeAll(async (done) => {
    connection = await createConnection();
    memberRepository = new MemberRepository(connection);
    await memberRepository.createMember(memberDTO);
    done();
  }, 60000);

  test("Returns access credentials when correct user and password are introduced", async done => {

    request(api.getApp())
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({email: memberDTO.email, password: "test"})
      .expect(200)
      .then(response => {

        const token: LoginResponseDTO = JSONSerialization.deserializeObject(response.body, LoginResponseDTO);

        expect(token.accessToken).not.toBeNull();
        expect(token.refreshToken).not.toBeNull();
        expect(token.expiresIn).toEqual(3600);
        expect(token.type).toEqual("Bearer");

        done();

      })
      .catch(error => {
        done.fail(error);
      });

  }, 60000);

	test("Returns unauthorized when wrong password is introduced", async done => {

	  expect.assertions(2);

		request(api.getApp())
			.post("/api/v1/auth/login")
			.set("Content-Type", "application/json")
			.send({email: memberDTO.email, password: "wrongPassword"})
			.expect(403)
			.then(response => {

				const error = response.body as APIError;

				expect(error.statusCode).toEqual(403);
				expect(error.message).not.toBeNull();

				done();

			})
			.catch(error => {
				done.fail(error);
			});

	}, 60000);

  afterAll(async (done) => {
    await memberRepository.deleteMemberByEmail("john.doe@gmail.com");
    done();
  }, 60000);

});