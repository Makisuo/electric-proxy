import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export * from "./auth-schema"

export const appsTable = sqliteTable("apps", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	clerkSecretKey: text("clerk_secret_key"),
	electricUrl: text("electric_url").notNull(),
	publicTables: text("public_tables", { mode: "json" }).notNull().$type<string[]>().default(sql`'[]'`),
	tenantColumnKey: text("tenant_column_key").notNull(),

	auth: text("auth", { mode: "json" }).notNull(),
	jwtId: text("jwt_id"),
	tenantId: text("tenant_id").notNull(),
})

export const jwtTable = sqliteTable("jwts", {
	id: text("id").primaryKey(),
	alg: text("alg").notNull(),
	publicKey: text("public_key").notNull(),
	provider: text("provider"),
})
