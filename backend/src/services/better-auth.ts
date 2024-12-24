import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { bearer } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/d1"
import { Config, Data, Effect } from "effect"
import { betterAuthOptions } from "~/lib/auth"

import { Resend } from "resend"

import * as schema from "../schema/schema"

export class BetterAuthApiError extends Data.TaggedError("BetterAuthApiError")<{
	readonly error: unknown
}> {}

export class BetterAuth extends Effect.Service<BetterAuth>()("BetterAuth", {
	effect: Effect.gen(function* () {
		const db = drizzle(global.env.DB)

		const githubClientId = yield* Config.string("GITHUB_CLIENT_ID")
		const githubClientSecret = yield* Config.string("GITHUB_CLIENT_SECRET")

		const auth = betterAuth({
			...betterAuthOptions,
			socialProviders: {
				github: {
					clientId: githubClientId,
					clientSecret: githubClientSecret,
					redirectURL: "https://api.electric-auth.com/better-auth/callback/github",
				},
			},
			database: drizzleAdapter(db, {
				provider: "sqlite",
				schema: schema,
			}),

			emailVerification: {
				sendOnSignUp: true,
				sendVerificationEmail: async ({ url, user }, request) => {
					const resend = new Resend(process.env.RESEND_API_KEY!)
					try {
						await resend.emails.send({
							from: "NoReply <no-reply@hazelapp.dev>",
							to: [user.email],
							subject: "Verify your email address",
							text: url,
						})
					} catch (err) {
						console.error(err, "Failed to send verification email")
					}

					return
				},
			},

			plugins: [bearer()],
		})

		const call = <A>(f: (client: typeof auth, signal: AbortSignal) => Promise<A>) =>
			Effect.tryPromise({
				try: (signal) => f(auth, signal),
				catch: (error) => new BetterAuthApiError({ error }),
			})

		return {
			call,
		} as const
	}),
}) {}
