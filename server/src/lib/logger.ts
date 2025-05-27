import { pino } from "pino";
import { resolve } from "node:path";
import type { Any } from "@server/types";

type Pino = ReturnType<typeof pino>;

export interface Logger {
	log(message: Any): void;
	debug(message: Any): void;
	info(message: Any): void;
	warn(message: Any): void;
	error(message: Any): void;
}

export class PinoLogger implements Logger {
	constructor(private pino: Pino) {}

	log(message: Any): void {
		this.pino.debug(message);
	}

	debug(message: Any): void {
		this.pino.debug(message);
	}

	info(message: Any): void {
		this.pino.info(message);
	}

	warn(message: Any): void {
		this.pino.warn(message);
	}

	error(message: Any): void {
		this.pino.error(message);
	}
}

export default new PinoLogger(
	pino(
		pino.transport({
			targets: [
				{
					target: "pino/file",
					options: {
						destination: resolve("../../logs/pino.log"),
						mkdir: true,
						append: true,
					},
				},
				{
					target: "pino-pretty",
					options: { colorize: true },
				},
			],
		}),
	),
);
