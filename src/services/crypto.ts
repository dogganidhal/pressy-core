import {sign, verify, SignOptions, VerifyOptions, JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {getConfig} from "../config";
import {exception} from "../common/errors";
import {Database} from "../common/db";
import {User} from "../common/model/entity/users";
import {Member} from "../common/model/entity/users/member";
import {Admin} from "../common/model/entity/users/admin/admin";
import {Driver} from "../common/model/entity/users/driver/driver";
import { RepositoryFactory } from "../common/repositories/factory";

export enum SigningCategory {
	MEMBER = 0,
	DRIVER = 1,
	LAUNDRER = 2,
	ADMIN = 3,
	SUPERUSER = 4
}

export enum AuthTokenType {
	BEARER = "Bearer"
}

interface IAuthPayload {
	id: any;
	category: SigningCategory
}

enum SigningSubject {
	ACCESS = "access",
	REFRESH = "refresh"
}

export class AuthCredentialsDto {
	accessToken: string;
	refreshToken: string;
	type: AuthTokenType;
	expiresIn: number
}

export namespace crypto {

	let __signOptions: SignOptions = {
		issuer: "pressy",
		algorithm: "RS256"
	};

	let __verifyOptions: VerifyOptions = {
		issuer: "pressy",
		algorithms: ["RS256"]
	};

	let _publicKey: string = getConfig().authenticationPublicKey;
	let _privateKey: string = getConfig().authenticationPrivateKey;

	

	export function signAuthToken(user: User, category: SigningCategory, options: SignOptions = {}): AuthCredentialsDto {

		let payload: IAuthPayload = {
			id: user.id,
			category: category
		};

		let signOptions = {
			...__signOptions,
			expiresIn: "1h",
			subject: SigningSubject.ACCESS,
			...options
		};

		const token = sign(payload, _privateKey, signOptions);
		const refreshToken = sign(payload, _privateKey, {...__signOptions, subject: SigningSubject.REFRESH});

		return {
			accessToken: token,
			refreshToken: refreshToken,
			type: AuthTokenType.BEARER,
			expiresIn: 3600
		};

	}

	export async function decodeJWT(encoded: string, category: SigningCategory | SigningCategory[]): Promise<User> {

		return new Promise<User>((resolve, reject) => {

			let verifyOptions = {
				...__verifyOptions,
				subject: SigningSubject.ACCESS
			};

			verify(encoded, _publicKey, verifyOptions, async (error: JsonWebTokenError, decoded) => {

				if (error) {

					if (error instanceof TokenExpiredError)
						reject(new exception.AccessTokenExpiredException);
					else
						reject(new exception.InvalidAccessTokenException);

					return;

				}

				let payload: IAuthPayload = typeof decoded == "string" ? JSON.parse(decoded) : decoded;
				let user: User | undefined;
				switch (payload.category) {
					case SigningCategory.MEMBER:
						user = await RepositoryFactory.instance.createMemberRepository().getMemberById(payload.id);
						break;
					case SigningCategory.ADMIN:
						user = await RepositoryFactory.instance.createAdminRepository().getAdminById(payload.id);
						break;
					case SigningCategory.DRIVER:
						user = await RepositoryFactory.instance.createDriverRepository().getDriverById(payload.id);
						break;
				}

				if (!user) {
					reject(new exception.AccessTokenNotFoundException);
				}

				if ((Array.isArray(category) && category.includes(payload.category)) || category === payload.category) {
					resolve(user);
					return;
				}

				reject(new exception.InvalidAccessTokenException);

			});

		});

	}

	export async function refreshCredentials(refreshToken: string): Promise<AuthCredentialsDto> {

		return new Promise<AuthCredentialsDto>((resolve, reject) => {

			let verifyOptions = {
				...__verifyOptions,
				subject: SigningSubject.REFRESH
			};

			verify(refreshToken, _publicKey, verifyOptions, async (error, decoded) => {

				if (error) {
					reject(new exception.InvalidRefreshTokenException);
					return;
				}

				let decodedPayload: IAuthPayload = typeof decoded == "string" ? JSON.parse(decoded) : decoded;
				let user: User | undefined;
				switch (decodedPayload.category) {
					case SigningCategory.MEMBER:
						user = await Database.getConnection().manager.findOne(Member, decodedPayload.id, {relations: ["person"]});
						break;
					case SigningCategory.ADMIN:
						user = await Database.getConnection().manager.findOne(Admin, decodedPayload.id, {relations: ["person"]});
						break;
					case SigningCategory.DRIVER:
						user = await Database.getConnection().manager.findOne(Driver, decodedPayload.id, {relations: ["person"]});
						break;
				}

				if (!user) {
					reject(new exception.AccessTokenNotFoundException);
				}

				let payload: IAuthPayload = {
					id: decodedPayload.id,
					category: decodedPayload.category
				};
				let signOptions = {
					...__signOptions,
					expiresIn: "1h",
					subject: SigningSubject.ACCESS
				};

				let token = sign(payload, _privateKey, signOptions);
				let refreshToken = sign(payload, _privateKey, {...__signOptions, subject: SigningSubject.REFRESH});

				resolve({
					accessToken: token,
					refreshToken: refreshToken,
					type: AuthTokenType.BEARER,
					expiresIn: 3600
				});

			});

		});

	}


}