import { HttpApiBuilder, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"
import { Api } from "~/api"
import { BetterAuth } from "~/services/better-auth"

export const HttpBetterAuthLive = HttpApiBuilder.group(Api, "BetterAuth", (handlers) =>
	Effect.gen(function* () {
		const betterAuth = yield* BetterAuth

		return handlers
			.handleRaw("betterAuthGet", () =>
				Effect.gen(function* () {
					const req = yield* HttpServerRequest.HttpServerRequest
					const raw = req.source as Request

					const authRes = yield* betterAuth.call((client) => client.handler(raw))

					console.log(authRes.headers)
					return yield* HttpServerResponse.raw(authRes.body, {
						status: authRes.status,
						statusText: authRes.statusText,
						headers: authRes.headers as any,
					})
				}).pipe(Effect.orDie),
			)
			.handleRaw("betterAuthPost", () =>
				Effect.gen(function* () {
					const req = yield* HttpServerRequest.HttpServerRequest
					const raw = req.source as Request

					const authRes = yield* betterAuth.call((client) => client.handler(raw))

					console.log(authRes.headers)

					return yield* HttpServerResponse.raw(authRes.body, {
						status: authRes.status,
						statusText: authRes.statusText,
						headers: authRes.headers as any,
					})
				}).pipe(Effect.orDie),
			)
	}).pipe(Effect.provide(BetterAuth.Default)),
)
