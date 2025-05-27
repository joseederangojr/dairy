import type { Database, UserSelect } from "@server/database/types";
import { type NoResultError, sql, type Kysely } from "kysely";
import {
	parseLoginDto,
	parseRegisterDto,
	type LoginDto,
	type RegisterDto,
} from "./auth.dto";
import type { LoginResponse, RegisterResponse } from "./auth.types";
import type { Hash } from "@server/lib/hash";
import type { Jwt } from "@server/lib/jwt";
import type { Environment } from "@server/environment";
import { wrap } from "@server/lib/util";
import type { ZodError } from "zod";
import { HashVerifyError, ValidationError } from "@server/errors/index";
import type { Ulid } from "@server/lib/ulid";
import database from "@server/database";
import hash from "@server/lib/hash";
import jwt from "@server/lib/jwt";
import environment from "@server/environment";
import ulid from "@server/lib/ulid";
import pinoLogger, { type Logger } from "@server/lib/logger";

interface IAuthService {
	login(data: LoginDto): Promise<LoginResponse>;
}

export class AuthService implements IAuthService {
	constructor(
		private database: Kysely<Database>,
		private hash: Hash,
		private jwt: Jwt,
		private config: Environment,
		private ulid: Ulid,
		private logger: Logger,
	) {}

	async login(data: LoginDto): Promise<LoginResponse> {
		const [parseError, login] = await wrap<LoginDto, ZodError<LoginDto>>(
			parseLoginDto(data),
		);

		if (parseError) {
			throw ValidationError.fromZodError(parseError);
		}

		const [userError, user] = await wrap<UserSelect, NoResultError>(
			this.database
				.selectFrom("users")
				.selectAll()
				.where("email", "=", login.email)
				.where("deletedAt", "is", null)
				.executeTakeFirstOrThrow(),
		);

		if (userError) {
			throw new ValidationError({
				email: ["Invalid email or password"],
			});
		}

		const [hashVerifiedError, hashVerified] = await wrap(
			this.hash.verify(login.password, user.password),
		);

		if (hashVerifiedError) {
			throw new HashVerifyError();
		}

		if (!hashVerified) {
			throw new ValidationError({
				email: ["Invalid email or password"],
			});
		}

		const accessToken = await this.jwt.sign(user.id);

		return {
			accessToken: accessToken,
			expiresIn: Date.now() + this.config.jwt.expires,
		};
	}

	async register(data: RegisterDto): Promise<RegisterResponse> {
		this.logger.info({ message: "Registering", data });
		const [parseError, register] = await wrap<
			RegisterDto,
			ZodError<RegisterDto>
		>(parseRegisterDto(data));

		if (parseError) {
			this.logger.error({ message: "register parse error", error: parseError });
			throw ValidationError.fromZodError(parseError);
		}

		const [, user] = await wrap<UserSelect, Error>(
			this.database
				.selectFrom("users")
				.selectAll()
				.where("email", "=", register.email)
				.where("deletedAt", "is", null)
				.executeTakeFirstOrThrow(),
		);

		if (user) {
			this.logger.error({ message: "register user exist", user });
			throw new ValidationError({
				email: ["Email is already taken."],
			});
		}

		const [hashMakeError, hashedPassword] = await wrap(
			this.hash.make(register.password),
		);

		if (hashMakeError) {
			this.logger.error({
				message: "register hash error",
				error: hashMakeError,
			});
			throw new HashVerifyError(hashMakeError?.message);
		}

		this.logger.info({
			message: "registering user",
			data: {
				id: this.ulid.generate(),
				name: register.name,
				email: register.email,
				password: hashedPassword,
				role: register.role,
			},
		});

		const [registerError, registeredUser] = await wrap(
			this.database
				.insertInto("users")
				.values({
					id: this.ulid.generate(),
					name: register.name,
					email: register.email,
					password: hashedPassword,
					role: register.role,
				})
				.returningAll()
				.executeTakeFirstOrThrow(),
		);

		if (registerError) {
			this.logger.error({ message: "register error", error: registerError });
			throw new ValidationError({
				email: ["Failed to create account", registerError.message],
			});
		}

		const accessToken = await this.jwt.sign(registeredUser.id);

		this.logger.info({ message: "register success", registeredUser });
		return {
			accessToken: accessToken,
			expiresIn: Date.now() + this.config.jwt.expires,
		};
	}
}

export default new AuthService(
	database,
	hash,
	jwt,
	environment,
	ulid,
	pinoLogger,
);
