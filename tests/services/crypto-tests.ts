import {Connection} from 'typeorm';
import {MemberRepository} from '../../src/common/repositories/member-repository';
import RandomString from "randomstring";
import {Member} from "../../src/common/model/entity/users/member";
import {Database} from "../../src/common/db";
import {Crypto} from "../../src/common/services/crypto";


describe("AuthRepository Operations Tests", () => {

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

		const authCredentials = Crypto.signAuthToken(member.person, Crypto.SigningCategory.MEMBER);

		expect(authCredentials.accessToken).not.toBeNull();
		expect(authCredentials.refreshToken).not.toBeNull();
		expect(authCredentials.type).toEqual(Crypto.AuthTokenType.BEARER);
		expect(authCredentials.expiresIn).toEqual(3600);

	}, 60000);

	afterAll(async (done) => {
		await memberRepository.deleteMemberByEmail(member.person.email);
		await connection.close();
		done();
	}, 60000);

});
