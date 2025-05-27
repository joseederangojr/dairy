import {
	replaceWithNoncontingentExpression,
	PostgresDialect,
	Kysely,
	CamelCasePlugin,
	DeduplicateJoinsPlugin,
	ParseJSONResultsPlugin,
	HandleEmptyInListsPlugin,
} from "kysely";
import { Pool } from "pg";
import environment from "../environment";
import type { Database } from "./types";
import logger from "@server/lib/logger";

export const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: environment.database.conn,
		host: environment.database.host,
		database: environment.database.name,
		user: environment.database.user,
		password: environment.database.pass,
		port: environment.database.port,
	}),
});

export const plugins = [
	new CamelCasePlugin(),
	new DeduplicateJoinsPlugin(),
	new ParseJSONResultsPlugin(),
	new HandleEmptyInListsPlugin({
		strategy: replaceWithNoncontingentExpression,
	}),
];

export default new Kysely<Database>({
	dialect,
	plugins,
	log(event) {
		const log = event.level === "query" ? "info" : "error";
		const logMesssage = event.level === "query" ? "Query:" : "Query Error:";
		logger[log]({
			message: logMesssage,
			data: {
				query: event.query.sql,
				parameters: event.query.parameters,
				duration: event.queryDurationMillis,
				...(event.level === "error"
					? {
							error: event.error,
						}
					: {}),
			},
		});
	},
});
