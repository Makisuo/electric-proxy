import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export * from "./auth-schema"

export const appsTable = sqliteTable("apps", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	clerkSecretKey: text("clerk_secret_key").notNull(),
	clerkPublishableKey: text("clerk_publishable_key").notNull(),
	electricUrl: text("electric_url").notNull(),
	publicTables: text("public_tables", { mode: "json" }).notNull().$type<string[]>().default(sql`'[]'`),
	tenantColumnKey: text("tenant_column_key").notNull(),

	auth: text("auth", { mode: "json" })
		.$type<{
			type: "bearer" | "basic" | null
			credentials: string | null
		}>()
		.notNull(),

	tenantId: text("tenant_id").notNull(),
})
