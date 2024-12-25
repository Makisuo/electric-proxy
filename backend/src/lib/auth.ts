import { type BetterAuthOptions, betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { bearer, oAuthProxy, oneTap } from "better-auth/plugins"
import { passkey } from "better-auth/plugins/passkey"

import { DrizzleD1Database } from "drizzle-orm/d1"

export const betterAuthOptions = {
	appName: "Electric Auth",
	trustedOrigins: ["http://localhost:3001", "https://app.electric-auth.com", "http://localhost:8484"],
	basePath: "/better-auth",
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	socialProviders: {},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
		},
	},

	plugins: [bearer(), oAuthProxy(), oneTap(), passkey()],
} satisfies BetterAuthOptions

export const auth = betterAuth({
	...betterAuthOptions,
	database: drizzleAdapter(DrizzleD1Database, {
		provider: "sqlite",
	}),
})
