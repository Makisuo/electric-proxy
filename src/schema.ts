import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export const appsTable = sqliteTable("apps", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	clerkSecretKey: text("clerk_secret_key").notNull(),
	clerkPublishableKey: text("clerk_publishable_key").notNull(),
	electricUrl: text("electric_url").notNull(),
	publicTables: text("public_tables", { mode: "json" }).notNull().$type<string[]>().default(sql`'[]'`),
})
