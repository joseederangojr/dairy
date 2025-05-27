import type { Environment } from "@server/environment";
import environment from "@server/environment";
import * as jose from "jose";

interface JWTPayload
	extends Record<string, string | string[] | number | number[] | undefined> {
	aud?: string;
	exp?: number;
	iat?: number;
	iss?: string;
	jti?: string;
	nbf?: number;
	sub?: string;
}

export interface JoseJwt {
	sign(sub: string): Promise<string>;
	verify(jwt: string): Promise<JWTPayload>;
}

export class Jwt implements JoseJwt {
	constructor(private config: Environment) {}
	async sign(sub: string): Promise<string> {
		const key = new TextEncoder().encode(this.config.jwt.secret);
		return new jose.SignJWT()
			.setSubject(sub)
			.setIssuedAt()
			.setProtectedHeader({
				alg: this.config.jwt.algorithm,
			})
			.setExpirationTime(Date.now() + this.config.jwt.expires)
			.sign(key);
	}

	async verify(jwt: string): Promise<JWTPayload> {
		const key = new TextEncoder().encode(this.config.jwt.secret);
		const verified = await jose.jwtVerify(jwt, key, {
			algorithms: [this.config.jwt.algorithm],
		});

		return verified.payload as JWTPayload;
	}
}

export default new Jwt(environment);
