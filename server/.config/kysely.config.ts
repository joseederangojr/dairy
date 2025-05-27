import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { dialect, plugins } from "../src/database";

export default defineConfig({
	dialect,
	migrations: {
		migrationFolder: "./src/database/migrations",
		getMigrationPrefix: getKnexTimestampPrefix,
	},
	plugins,
	seeds: {
		seedFolder: "./src/database/seeds",
		getSeedPrefix: getKnexTimestampPrefix,
	},
});
