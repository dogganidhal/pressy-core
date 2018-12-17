import Randomstring from 'randomstring';
import request from "supertest";
import { Connection } from 'typeorm';
import { APIV1 } from "../../src/common/http/api";
import { MemberRepository } from '../../src/common/repositories/users/member-repository';
import {APIError} from "../../src/common/errors/api-error";
import {Database} from "../../src/common/db";
import uuid = require("uuid");
import {MobileDevice} from "../../src/common/model/entity/users/device";
import {SigningCategory, crypto, AuthCredentials} from "../../src/services/crypto";
import {http} from "../../src/common/utils/http";
import { CreatePersonRequest, MobileDevice as MobileDeviceDTO} from '../../src/common/model/dto';

describe("Testing MemberController Endpoints =>", () => {

  let connection: Connection;
  let memberRepository: MemberRepository;
  const api = new APIV1(require("../../src/mobile-api/config"));
  const memberDTO: CreatePersonRequest = {
    firstName: Randomstring.generate(10),
    lastName: Randomstring.generate(10),
    email: `${Randomstring.generate(10)}@test.com`,
    phone: Randomstring.generate({length: 10, charset: "numeric"}),
    password: 'qwerty2018'
  };
	const duplicateMemberDTO = {
		firstName: Randomstring.generate(10),
		lastName: Randomstring.generate(10),
		email: `${Randomstring.generate(10)}@test.com`,
		phone: Randomstring.generate({length: 10, charset: "numeric"}),
		password: 'qwerty2018'
	} as CreatePersonRequest;

  beforeAll(async done => {
    connection = await Database.createConnection();
    memberRepository = new MemberRepository(connection);
	  await memberRepository.createMember(duplicateMemberDTO);
    done();
  }, 60000);

  it("Creates a new person with correct data", async done => {

    return request(api.getApp())
      .post("/v1/member")
      .set("Content-Type", "application/json")
      .send(memberDTO)
	    .expect(http.HttpStatus.HTTP_STATUS_OK)
	    .then((response) => {

	     	let authCredentials = response.body as AuthCredentials;
	     	expect(authCredentials.accessToken).not.toBeNull();
				expect(authCredentials.refreshToken).not.toBeNull();
				expect(authCredentials.type).toEqual("Bearer");
				expect(authCredentials.expiresIn).toEqual(3600);

		    done();
	    })
	    .catch(error => {
	    	console.warn(error);
		    done.fail(error);
	    });

  }, 60000);

	it("Returns an error when the introduced email exists already", async done => {

		expect.assertions(2);

		return request(api.getApp())
			.post("/v1/member")
			.set("Content-Type", "application/json")
			.send(duplicateMemberDTO)
			.expect(http.HttpStatus.HTTP_STATUS_BAD_REQUEST)
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

	it("Registers a MobileDevice for a given member", async done => {

		expect.assertions(2);

		let mobileDeviceId = uuid.v1().toString();
		let mobileDevice: MobileDeviceDTO = {
			deviceId: mobileDeviceId
		};
		let member = await memberRepository.createMember({
			firstName: Randomstring.generate(10),
			lastName: Randomstring.generate(10),
			email: `${Randomstring.generate(10)}@email.com`,
			password: "qwerty2018",
			phone: Randomstring.generate({length: 10, charset: "numeric"})
		});

		let {accessToken} = crypto.signAuthToken(member.person, SigningCategory.MEMBER);

		return request(api.getApp())
			.post("/v1/member/devices")
			.set("Content-Type", "application/json")
			.set("Authorization", `Bearer ${accessToken}`)
			.send(mobileDevice)
			.expect(http.HttpStatus.HTTP_STATUS_CREATED)
			.then(async _ => {

				let mobileDeviceRepository = connection.getRepository(MobileDevice);
				let mobileDeviceEntity = await mobileDeviceRepository.findOneOrFail(mobileDeviceId, {relations: ["person"]});

				expect(mobileDeviceEntity.id).toEqual(mobileDeviceId);
				expect(mobileDeviceEntity.person.id).toEqual(member.person.id);

				await memberRepository.deleteMemberByEmail(member.person.email);

				done();

			})
			.catch(async error => {
				console.warn(error);
				await memberRepository.deleteMemberByEmail(member.person.email);
				done.fail(error);
			});

	}, 60000);


	afterAll(async done => {
	  await memberRepository.deleteMemberByEmail(duplicateMemberDTO.email);
    await memberRepository.deleteMemberByEmail(memberDTO.email);
    await connection.close();
    done();
  }, 60000);

});