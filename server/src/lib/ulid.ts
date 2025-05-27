import * as ulid from "ulid";
export interface IdGenerator {
	generate(timestamp?: number): string;
	verify(str: string): boolean;
}

export class Ulid implements IdGenerator {
	generate(timestamp?: number): string {
		return ulid.ulid(timestamp);
	}

	verify(str: string): boolean {
		return ulid.isValid(str);
	}
}

export default new Ulid();
