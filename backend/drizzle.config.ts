import { defineConfig } from "drizzle-kit"
export default defineConfig({
	dialect: "sqlite",
	schema: "./src/schema/schema.ts",
	driver: "d1-http",
	out: "./migrations",
})
