import {Connection} from 'typeorm';
import {MemberRepository} from '../../src/common/repositories/member-repository';
import RandomString from "randomstring";
import {Member} from "../../src/common/model/entity/users/member";
import {Database} from "../../src/common/db";
import {Crypto} from "../../src/common/services/crypto";
import {Exception} from "../../src/common/errors";


describe("Crypto Operations Tests", () => {

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

		let authCredentials = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);

		expect(authCredentials.accessToken).not.toBeNull();
		expect(authCredentials.refreshToken).not.toBeNull();
		expect(authCredentials.type).toEqual(Crypto.AuthTokenType.BEARER);
		expect(authCredentials.expiresIn).toEqual(3600);

	}, 60000);

	test("Throws an error when corrupted token is given", async done => {

		expect.assertions(1);

		let authCredentials = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);
		let accessToken = authCredentials.accessToken.slice(0, authCredentials.accessToken.length - 10);

		try {
			let _ = await Crypto.decodeJWT(accessToken, Crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.InvalidAccessTokenException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Throws an error when expired token is given", async done => {

		expect.assertions(1);

		let authCredentials = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER, {expiresIn: 0});
		let accessToken = authCredentials.accessToken;

		try {
			let _ = await Crypto.decodeJWT(accessToken, Crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.AccessTokenExpiredException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Throws an error when a token with the wrong subject is given", async done => {

		expect.assertions(1);

		let authCredentials = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER, {subject: "refresh"});

		try {
			let _ = await Crypto.decodeJWT(authCredentials.accessToken, Crypto.SigningCategory.MEMBER);
			done.fail();
		} catch (error) {
			expect(error instanceof Exception.InvalidAccessTokenException).toBeTruthy();
			done();
		}

	}, 60000);

	test("Creates new credentials from refreshToken", async done => {

		expect.assertions(5);

		try {

			let { refreshToken } = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);
			let { accessToken } = await Crypto.refreshCredentials(refreshToken);
			let person = await Crypto.decodeJWT(accessToken, Crypto.SigningCategory.MEMBER);

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

		let {refreshToken} = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);
		refreshToken = refreshToken.slice(0, refreshToken.length - 10);

		try {
			let _ = await Crypto.refreshCredentials(refreshToken);
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
