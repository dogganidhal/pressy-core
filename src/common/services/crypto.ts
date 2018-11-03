import {sign, verify, SignOptions, VerifyOptions, JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {getConfig} from "../../config";
import {Exception} from "../errors";
import {Database} from "../db";
import {Person} from "../model/entity/users/person";
import {PersonRepository} from "../repositories/person-repository";


export namespace Crypto {

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

	export interface IAuthCredentials {
		accessToken: string;
		refreshToken: string;
		type: AuthTokenType;
		expiresIn: number
	}

	export function signAuthToken(person: Person, category: SigningCategory): IAuthCredentials {

		let payload: IAuthPayload = {
			id: person.id,
			category: category
		};

		const token = sign(payload, _privateKey, {...__signOptions, expiresIn: "1h", subject: SigningSubject.ACCESS});
		const refreshToken = sign(payload, _privateKey, {...__signOptions, subject: SigningSubject.REFRESH});

		return {
			accessToken: token,
			refreshToken: refreshToken,
			type: AuthTokenType.BEARER,
			expiresIn: 3600
		};

	}

	export async function decodeJWT(encoded: string, category: SigningCategory | SigningCategory[]): Promise<Person> {

		return new Promise<Person>((resolve, reject) => {

			let verifyOptions = {
				...__verifyOptions,
				subject: SigningSubject.ACCESS
			};

			verify(encoded, _publicKey, verifyOptions, async (error: JsonWebTokenError, decoded) => {

				let personRepository = new PersonRepository(Database.getConnection());

				if (error) {

					if (error instanceof TokenExpiredError)
						reject(new Exception.AccessTokenExpiredException);
					else
						reject(new Exception.InvalidAccessTokenException);

					return;

				}

				let payload: IAuthPayload = typeof decoded == "string" ? JSON.parse(decoded) : decoded;
				let person = await personRepository.getPersonById(payload.id);

				if (!person) {
					reject(new Exception.AccessTokenNotFoundException);
				}

				if ((Array.isArray(category) && category.includes(payload.category)) || category === payload.category || payload.category == SigningCategory.SUPERUSER) {
					resolve(person);
					return;
				}

				reject(new Exception.UnauthorizedRequestException);

			});

		});

	}


}