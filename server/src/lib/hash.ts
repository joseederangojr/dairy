import type { Environment } from "@server/environment";
import environment from "@server/environment";
import * as crypto from "node:crypto";

export interface Hash {
	make(plain: string): Promise<string>;
	verify(plain: string, password: string): Promise<boolean>;
}

export class CryptoHash implements Hash {
	constructor(private config: Environment) {}
	make(plain: string): Promise<string> {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(
				plain,
				this.config.password.salt,
				this.config.password.iterations,
				this.config.password.length,
				this.config.password.algorithm,
				(err, result) => {
					if (err) return reject(err);
					return resolve(result.toHex());
				},
			);
		});
	}

	async verify(plain: string, password: string): Promise<boolean> {
		return (await this.make(plain)) === password;
	}
}

export default new CryptoHash(environment);
