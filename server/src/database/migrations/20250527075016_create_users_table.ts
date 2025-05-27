import { sql, type Kysely } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny:
export async function up(db: Kysely<any>): Promise<void> {
	db.schema
		.createTable("users")
		.addColumn("id", "varchar(26)", (c) => c.unique().notNull().primaryKey())
		.addColumn("name", "varchar(255)", (c) => c.notNull())
		.addColumn("email", "varchar(150)", (c) => c.notNull())
		.addColumn("password", "varchar(128)", (c) => c.notNull())
		.addColumn("role", "smallint", (c) => c.notNull())
		.addColumn("createdAt", "timestamp", (c) =>
			c.defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (c) =>
			c.defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("deletedAt", "timestamp")
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny:
export async function down(_: Kysely<any>): Promise<void> {
	_.schema.dropTable("users").execute();
}
