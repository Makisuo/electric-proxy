import { FetchHttpClient, HttpApiBuilder, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Effect, Layer, Schema } from "effect"
import { Api } from "~/api"

const clerkBaseUrl = "https://api.clerk.dev"

export const HttpAuthLive = HttpApiBuilder.group(Api, "Auth", (handlers) =>
	Effect.gen(function* () {
		return handlers.handle("verifyAuthToken", ({ payload }) =>
			Effect.gen(function* () {
				const defaultClient = yield* HttpClient.HttpClient
				const httpClient = defaultClient.pipe(HttpClient.filterStatusOk)

				return yield* HttpClientRequest.get("/v1/instance").pipe(
					HttpClientRequest.prependUrl(clerkBaseUrl),
					HttpClientRequest.setHeader("Authorization", `Bearer ${payload.credentials}`),
					httpClient.execute,
					Effect.timeout("5 seconds"),
					Effect.flatMap(
						HttpClientResponse.schemaBodyJson(
							Schema.Struct({
								object: Schema.Literal("instance"),
								id: Schema.String,
								environment_type: Schema.String,
								allowed_origins: Schema.NullOr(Schema.Array(Schema.String)),
							}),
						),
					),
					Effect.scoped,
					Effect.tap((v) => Effect.logInfo(v)),
					Effect.tapError((e) => Effect.logError(e)),
					Effect.flatMap((value) =>
						Effect.succeed({
							id: value.id,
							environmentType: value.environment_type,
							valid: true,
						}),
					),
					Effect.catchAll(() => Effect.succeed({ valid: false, id: null, environmentType: null })),
				)
			}),
		)
	}),
).pipe(Layer.provide(FetchHttpClient.layer))
