import { MemberRepository } from '../../src/common/repositories/member-repository';
import { Connection } from 'typeorm';
import { API } from "../../src/api";
import request from "supertest";
import {APIError} from "../../src/api/model/api-error";
import RandomString from "randomstring";
import {Database} from "../../src/common/db";
import {crypto} from "../../src/common/services/crypto";
import AuthTokenType = crypto.AuthTokenType;
import * as DTO from "../../src/common/model/dto";

describe("Testing Authentication Endpoints", () => {

	let connection: Connection;
	let memberRepository: MemberRepository;
	const api: API = new API;
	const testMember: DTO.member.CreateMemberRequest = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		password: "test",
		phone: RandomString.generate({length: 10, charset: "numeric"}),
	};

  beforeAll(async (done) => {

    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);

    await memberRepository.createMember(testMember);

    done();

  }, 60000);

  test("Returns access credentials when correct user and password are introduced", async done => {

  	expect.assertions(4);

    request(api.getApp())
      .post("/api/v1/auth/person")
      .set("Content-Type", "application/json")
      .send({email: testMember.email, password: "test"})
      .expect(200)
      .then(response => {

        const token: DTO.member.LoginResponse = response.body as DTO.member.LoginResponse;

        expect(token.accessToken).not.toBeNull();
        expect(token.refreshToken).not.toBeNull();
        expect(token.expiresIn).toEqual(3600);
        expect(token.type).toEqual(AuthTokenType.BEARER);

        done();

      })
      .catch(error => {
        done.fail(error);
      });

  }, 60000);

	test("Returns bad request when email is missing", async done => {

		expect.assertions(3);

		request(api.getApp())
			.post("/api/v1/auth/person")
			.set("Content-Type", "application/json")
			.send({email: testMember.email})
			.expect(400)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(400);
				expect(error.message).not.toBeNull();

				done();

			})
			.catch(error => {
				done.fail(error);
			});

	}, 60000);

	test("Returns bad request when password is missing", async done => {

		expect.assertions(3);

		request(api.getApp())
			.post("/api/v1/auth/person")
			.set("Content-Type", "application/json")
			.send({email: testMember.email})
			.expect(400)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(400);
				expect(error.message).not.toBeNull();

				done();

			})
			.catch(error => {
				done.fail(error);
			});

	}, 60000);

	test("Returns bad request when empty body is given", async done => {

		expect.assertions(3);

		request(api.getApp())
			.post("/api/v1/auth/person")
			.set("Content-Type", "application/json")
      .send()
			.expect(400)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(400);
				expect(error.message).not.toBeNull();

				done();

			})
			.catch(error => {
				done.fail(error);
			});

	}, 60000);

	test("Returns unauthorized when wrong password is introduced", async done => {

	  expect.assertions(2);

		request(api.getApp())
			.post("/api/v1/auth/person")
			.set("Content-Type", "application/json")
			.send({email: testMember.email, password: "wrongPassword"})
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

	test("Returns not found when non-existent email is introduced", async done => {

		expect.assertions(2);

		request(api.getApp())
			.post("/api/v1/auth/person")
			.set("Content-Type", "application/json")
			.send({email: "doesNotExist@email.com", password: "test"})
			.expect(404)
			.then(response => {

				const error = response.body as APIError;

				expect(error.statusCode).toEqual(404);
				expect(error.message).not.toBeNull();

				done();

			})
			.catch(error => {
				done.fail(error);
			});

	}, 60000);

  afterAll(async (done) => {
    await memberRepository.deleteMemberByEmail(testMember.email);
    await connection.close();
    done();
  }, 60000);

});