import { MemberRepository } from '../../src/common/repositories/users/member-repository';
import { Connection } from 'typeorm';
import { MobileAPI } from "../../src/mobile-api";
import request from "supertest";
import {APIError} from "../../src/common/errors/api-error";
import RandomString from "randomstring";
import {Database} from "../../src/common/db";
import {crypto, AuthTokenType} from "../../src/services/crypto";
import {http} from "../../src/common/utils/http";
import { CreatePersonRequest, LoginResponse } from '../../src/common/model/dto';

describe("Testing Authentication Endpoints", () => {

	let connection: Connection;
	let memberRepository: MemberRepository;
	const api: MobileAPI = new MobileAPI;
	const testMember: CreatePersonRequest = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		password: "qwerty2018",
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
      .post("/v1/auth")
      .set("Content-Type", "application/json")
      .send({email: testMember.email, password: testMember.password})
      .expect(http.HttpStatus.HTTP_STATUS_OK)
      .then(response => {

        const token = response.body as LoginResponse;

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
			.post("/v1/auth")
			.set("Content-Type", "application/json")
			.send({email: testMember.email})
			.expect(http.HttpStatus.HTTP_STATUS_BAD_REQUEST)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(http.HttpStatus.HTTP_STATUS_BAD_REQUEST);
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
			.post("/v1/auth")
			.set("Content-Type", "application/json")
			.send({email: testMember.email})
			.expect(http.HttpStatus.HTTP_STATUS_BAD_REQUEST)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(http.HttpStatus.HTTP_STATUS_BAD_REQUEST);
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
			.post("/v1/auth")
			.set("Content-Type", "application/json")
      .send()
			.expect(http.HttpStatus.HTTP_STATUS_BAD_REQUEST)
			.then(response => {

				const error = response.body as APIError;

				expect(error.name).toEqual("MissingFieldsException");
				expect(error.statusCode).toEqual(http.HttpStatus.HTTP_STATUS_BAD_REQUEST);
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
			.post("/v1/auth")
			.set("Content-Type", "application/json")
			.send({email: testMember.email, password: "wrongPassword"})
			.expect(http.HttpStatus.HTTP_STATUS_UNAUTHORIZED)
			.then(response => {

				const error = response.body as APIError;

				expect(error.statusCode).toEqual(http.HttpStatus.HTTP_STATUS_UNAUTHORIZED);
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
			.post("/v1/auth")
			.set("Content-Type", "application/json")
			.send({email: "doesNotExist@email.com", password: testMember.password})
			.expect(http.HttpStatus.HTTP_STATUS_NOT_FOUND)
			.then(response => {

				const error = response.body as APIError;

				expect(error.statusCode).toEqual(http.HttpStatus.HTTP_STATUS_NOT_FOUND);
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