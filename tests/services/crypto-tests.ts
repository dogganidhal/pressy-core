import {Connection} from 'typeorm';
import {MemberRepository} from '../../src/common/repositories/member-repository';
import RandomString from "randomstring";
import {Member} from "../../src/common/model/entity/users/member";
import {Database} from "../../src/common/db";
import {crypto} from "../../src/common/services/crypto";
import {Exception} from "../../src/common/errors";


describe("crypto Operations Tests", () => {

	let connection: Connection;
	let memberRepository: MemberRepository;
	let member: Member;

	beforeAll(async (done) => {
		connection = await Database.createConnection();
		memberRepository = new MemberRepository(connection);
		member = await memberRepository.createMember({
			firstName: RandomString.generate(10),
			lastName: RandomString.generate(10),
			password: RandomString.generate(10),
			phone: RandomString.generate({length: 10, charset: "numeric"}),
			email : `${RandomString.generate(10)}@email.com`
		});
		done();
	}, 60000);

	test("Returns auth credentials for a registered member", () => {

		let authCredentials = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER);

		expect(authCredentials.accessToken).not.toBeNull();
		expect(authCredentials.refreshToken).not.toBeNull();
		expect(authCredentials.type).toEqual(crypto.AuthTokenType.BEARER);
		expect(authCredentials.expiresIn).toEqual(3600);

	}, 60000);

	test("Throws an error when corrupted token is given", async done => {

		expect.assertions(1);

		let authCredentials = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER);
		let accessToken = authCredentials.accessToken.slice(0, authCredentials.accessToken.length - 10);

		try {
			let _ = await crypto.decodeJWT(accessToken, crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.InvalidAccessTokenException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Throws an error when expired token is given", async done => {

		expect.assertions(1);

		let authCredentials = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER, {expiresIn: 0});
		let accessToken = authCredentials.accessToken;

		try {
			let _ = await crypto.decodeJWT(accessToken, crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.AccessTokenExpiredException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Throws an error when a token with the wrong subject is given", async done => {

		expect.assertions(1);

		let authCredentials = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER, {subject: "refresh"});

		try {
			let _ = await crypto.decodeJWT(authCredentials.accessToken, crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.InvalidAccessTokenException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Creates new credentials from refreshToken", async done => {

		expect.assertions(5);

		try {

			let { refreshToken } = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER);
			let { accessToken } = await crypto.refreshCredentials(refreshToken);
			let person = await crypto.decodeJWT(accessToken, crypto.SigningCategory.MEMBER);

			expect(person.id).toEqual(member.person.id);
			expect(person.firstName).toEqual(member.person.firstName);
			expect(person.lastName).toEqual(member.person.lastName);
			expect(person.email).toEqual(member.person.email);
			expect(person.phone).toEqual(member.person.phone);

		} catch (error) {
			done.fail(error);
		}

		done();

	}, 60000);

	test("Throws an error when a corrupted refreshToken is given", async done => {

		expect.assertions(1);

		let {refreshToken} = crypto.signAuthToken(member.person, crypto.SigningCategory.MEMBER);
		refreshToken = refreshToken.slice(0, refreshToken.length - 10);

		try {
			let _ = await crypto.refreshCredentials(refreshToken);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.InvalidRefreshTokenException).toBeTruthy();
			done();
		}

	}, 60000);

	afterAll(async (done) => {
		await memberRepository.deleteMemberByEmail(member.person.email);
		await connection.close();
		done();
	}, 60000);

});
