import { Effect } from "effect"

export class Cloudflare extends Effect.Service<Cloudflare>()("Service/Cloudflare", {
	effect: Effect.gen(function* () {
		const waitUntil = Effect.fn("Service/Cloudflare.waitUntil")((promise: Promise<void>) =>
			Effect.promise<void>(() => globalThis.waitUntil(promise)),
		)

		return {
			waitUntil,
		} as const
	}),
}) {}
