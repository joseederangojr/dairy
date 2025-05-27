export {};

declare module "bun" {
	interface Env {
		APP_NAME: string;
		APP_DOMAIN: string;
		APP_URL: string;
		APP_PORT: string;
		APP_HTTP_SCHEME: string;

		PG_HOST: string;
		PG_NAME: string;
		PG_USER: string;
		PG_PASS: string;
		PG_PORT: string;
		PG_CONN?: string;

		PW_SALT: string;
		PW_ITERATION: string;
		PW_LENGTH: string;
		PW_ALGORITHM: string;

		JWT_SECRET: string;
		JWT_EXPIRES: string;
		JWT_ISSUER: string;
		JWT_ALGORITHM: string;
	}
}
