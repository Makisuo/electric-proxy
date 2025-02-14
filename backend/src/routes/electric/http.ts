import {
	FetchHttpClient,
	HttpApiBuilder,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
	HttpServerRequest,
	HttpServerResponse,
} from "@effect/platform"
import { Effect, Either, Layer, Match, Schema } from "effect"
import { Api } from "~/api"
import { AppHelper } from "../app/app"

import { withSystemActor } from "~/policy"
import { Cloudflare } from "~/services/cloudflare"
import { JWT, Jose } from "~/services/jose"
import { genAuthHeader } from "./helper"

export const HttpElectricLive = HttpApiBuilder.group(Api, "Electric", (handlers) =>
	Effect.gen(function* () {
		return handlers
			.handleRaw("v1/shape", ({ path }) =>
				Effect.gen(function* () {
					const appHelper = yield* AppHelper
					const jose = yield* Jose

					const app = yield* appHelper.findById(path.id).pipe(withSystemActor)

					if (!app.jwt) {
						return yield* HttpServerResponse.json(
							{ message: "No JWT Provider Configured" },
							{ status: 401 },
						)
					}

					const req = yield* HttpServerRequest.HttpServerRequest
					const raw = req.source as Request

					const url = new URL(raw.url)
					const table = url.searchParams.get("table") as string

					if (!table) {
						return yield* HttpServerResponse.json(
							{ message: "Needs to have a table param" },
							{ status: 404 },
						)
					}

					const bearer = raw.headers.get("Authorization")

					if (!bearer) {
						return yield* HttpServerResponse.json(
							{ message: "Needs to have a bearer token" },
							{ status: 401 },
						)
					}
					// TODO: I should update the JWT schema to make sure the right values are always set based on the provider

					const result = yield* Effect.gen(function* () {
						if (app.jwt?.provider === "custom-remote") {
							return yield* jose
								.jwtVerifyRemote(
									app.jwt.publicKeyRemote!,
									JWT.make(bearer.replace("Bearer", "").trim()),
								)
								.pipe(Effect.either)
						}

						return yield* jose
							.jwtVerify(
								app.jwt?.publicKey!,
								JWT.make(bearer.replace("Bearer", "").trim()),
								app.jwt?.alg!,
							)
							.pipe(Effect.either)
					})

					if (Either.isLeft(result)) {
						return yield* HttpServerResponse.json(result.left, {
							status: 401,
						})
					}

					const userId = result.right.payload.sub

					if (!userId) {
						return yield* HttpServerResponse.json(
							{ message: "Invalid JWT needs to have a sub, to indentify the user" },
							{ status: 401 },
						)
					}

					const originUrl = new URL("/v1/shape", app.electricUrl)
					if (!app.publicTables.includes(table)) {
						originUrl.searchParams.set("where", `${app.tenantColumnKey} = '${userId}'`)
					}

					url.searchParams.forEach((value, key) => {
						if (["live", "table", "handle", "offset", "cursor"].includes(key)) {
							originUrl.searchParams.set(key, value)
						}
					})

					const authHeader = Match.value(app.auth).pipe(
						Match.when({ type: "basic" }, (auth) => `Basic ${btoa(`${auth.username}:${auth.password}`)}`),
						Match.when({ type: "bearer" }, (auth) => `Bearer ${auth.credentials}`),
						Match.orElse(() => ""),
					)

					if (app.auth?.type === "electric-cloud") {
						originUrl.searchParams.set("source_id", app.auth.sourceId)
						originUrl.searchParams.set("source_secret", app.auth.sourceSecret)
					}

					const resp = yield* Effect.promise(() =>
						fetch(originUrl.toString(), {
							headers: {
								Authorization: authHeader,
							},
						}),
					)

					globalThis.env.USER_TRACKING.writeDataPoint({
						blobs: [app.id, userId, table],
						doubles: [resp.status],
						indexes: [app.id],
					})

					if (resp.status === 204) {
						return yield* HttpServerResponse.empty({
							status: resp.status,
							statusText: resp.statusText,
							headers: resp.headers as any,
						})
					}

					if (resp.headers.get("content-encoding")) {
						const newHeaders = new Headers(resp.headers)
						newHeaders.delete("content-encoding")
						newHeaders.delete("content-length")

						return yield* HttpServerResponse.json(resp.body, {
							status: resp.status,
							statusText: resp.statusText,
							headers: newHeaders as any,
						})
					}

					yield* Effect.logInfo(resp.status, resp.statusText)

					return yield* HttpServerResponse.raw(resp.body, {
						status: resp.status,
						statusText: resp.statusText,
						headers: resp.headers as any,
					})
				}).pipe(Effect.tapError(Effect.logError), Effect.orDie),
			)
			.handle("v1/verifyUrl", ({ payload }) =>
				Effect.gen(function* () {
					const client = yield* HttpClient.HttpClient

					return yield* HttpClientRequest.get("/v1/health").pipe(
						HttpClientRequest.prependUrl(payload.url),
						genAuthHeader(payload.auth),
						client.execute,
						Effect.timeout("3 seconds"),
						Effect.flatMap(
							HttpClientResponse.schemaBodyJson(
								Schema.Struct({
									status: Schema.String,
								}),
							),
						),
						Effect.scoped,
						Effect.tap((v) => Effect.logInfo(v)),
						Effect.tapError((e) => Effect.logError(e)),
						Effect.flatMap((value) =>
							Effect.succeed({
								valid: value.status === "active",
							}),
						),
						Effect.catchAll(() => Effect.succeed({ valid: payload.auth.type === "electric-cloud" })),
					)
				}).pipe(Effect.orDie),
			)
	}),
).pipe(Layer.provide([AppHelper.Default, Cloudflare.Default, Jose.Default, FetchHttpClient.layer]))
