import type { Env } from "bun";
import * as z from "zod";

const environmentSchema = z.object({
	app: z.object({
		name: z.string(),
		domain: z.string(),
		url: z.string().url(),
		port: z.number({ coerce: true }),
		httpScheme: z.enum(["http", "https"]).default("http"),
		environment: z
			.enum(["development", "staging", "testing", "production"])
			.default("development"),
	}),
	database: z.object({
		host: z.string(),
		name: z.string(),
		user: z.string(),
		pass: z.string(),
		port: z.number({ coerce: true }),
		conn: z.string().optional(),
	}),
	password: z.object({
		salt: z.string(),
		iterations: z.number({ coerce: true }),
		length: z.number({ coerce: true }),
		algorithm: z
			.enum(["md5", "sha1", "sha256", "sha384", "sha512"])
			.default("sha256"),
	}),
	jwt: z.object({
		secret: z.string(),
		expires: z.number({ coerce: true }),
		issuer: z.string(),
		algorithm: z.enum(["HS256", "HS512", "RS256", "ES256"]).default("HS512"),
	}),
});

export type Environment = z.infer<typeof environmentSchema>;

const parseEnvironment = (env: Env): Environment => {
	return environmentSchema.parse({
		app: {
			name: env.APP_NAME,
			domain: env.APP_DOMAIN,
			url: env.APP_URL,
			port: env.APP_PORT,
			httpScheme: env.APP_HTTP_SCHEME,
			environment: env.NODE_ENV,
		},
		database: {
			host: env.PG_HOST,
			name: env.PG_NAME,
			user: env.PG_USER,
			pass: env.PG_PASS,
			port: env.PG_PORT,
			conn: env.PG_CONN,
		},
		password: {
			salt: env.PW_SALT,
			iterations: env.PW_ITERATION,
			length: env.PW_LENGTH,
			algorithm: env.PW_ALGORITHM,
		},
		jwt: {
			secret: env.JWT_SECRET,
			expires: env.JWT_EXPIRES,
			issuer: env.JWT_ISSUER,
			algorithm: env.JWT_ALGORITHM,
		},
	});
};

export default parseEnvironment(process.env);
