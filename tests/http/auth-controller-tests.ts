import { MemberRepository } from '../../src/common/repositories/member-repository';
import { Connection } from 'typeorm';
import { MemberRegistrationDTO } from '../../src/common/model/dto/member';
import { LoginResponseDTO } from '../../src/common/model/dto/member';
import { API } from "../../src/api";
import request from "supertest";
import {APIError} from "../../src/api/model/api-error";
import RandomString from "randomstring";
import {Person} from "../../src/common/model/entity/users/person";
import {Member} from "../../src/common/model/entity/users/member";
import {Database} from "../../src/common/db";

describe("Testing Authentication Endpoints", () => {

	let connection: Connection;
	let memberRepository: MemberRepository;
	const api: API = new API;
	const testMember: MemberRegistrationDTO = {
		firstName: RandomString.generate(10),
		lastName: RandomString.generate(10),
		email: `${RandomString.generate(10)}@email.com`,
		password: "test",
		phone: RandomString.generate({length: 10, charset: "numeric"}),
	};

  beforeAll(async (done) => {

    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);
    let __dbPersonRepository = connection.getRepository(Person);
    let __dbMemberRepository = connection.getRepository(Member);

    await __dbPersonRepository.insert(Person.create(testMember));
    await __dbMemberRepository.insert(Member.create(testMember));

    done();

  }, 60000);

  test("Returns access credentials when correct user and password are introduced", async done => {

  	expect.assertions(4);

    request(api.getApp())
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({email: testMember.email, password: "test"})
      .expect(200)
      .then(response => {

        const token: LoginResponseDTO = response.body as LoginResponseDTO;

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

	test("Returns bad request when empty body is given", async done => {

		expect.assertions(2);

		request(api.getApp())
			.post("/api/v1/auth/login")
			.set("Content-Type", "application/json")
      .send()
			.expect(400)
			.then(response => {

				const error = response.body as APIError;

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
			.post("/api/v1/auth/login")
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

	test("Returns not found when non-existant email is introduced", async done => {

		expect.assertions(2);

		request(api.getApp())
			.post("/api/v1/auth/login")
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
    done();
  }, 60000);

});