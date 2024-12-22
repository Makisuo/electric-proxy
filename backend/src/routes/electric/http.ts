import { createClerkClient } from "@clerk/backend"
import {
	FetchHttpClient,
	HttpApiBuilder,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
	HttpServerRequest,
	HttpServerResponse,
} from "@effect/platform"
import { Effect, Layer, Match, Option, Schema } from "effect"
import { Api } from "~/api"
import { AppNotFound } from "~/models/app"
import { AppRepo } from "~/repositories/app-repo"

export const HttpElectricLive = HttpApiBuilder.group(Api, "Electric", (handlers) =>
	Effect.gen(function* () {
		return handlers
			.handleRaw("v1/shape", ({ path }) =>
				Effect.gen(function* () {
					const appRepo = yield* AppRepo

					const app = yield* appRepo.findById(path.id).pipe(
						Effect.flatMap(
							Option.match({
								onNone: () => new AppNotFound({ id: path.id }),
								onSome: Effect.succeed,
							}),
						),
					)

					yield* Effect.logInfo(app)

					const req = yield* HttpServerRequest.HttpServerRequest
					const raw = req.source as Request

					const url = new URL(raw.url)
					const table = url.searchParams.get("table") as string

					if (!table) {
						return yield* HttpServerResponse.json({ error: "Needs to have a table param" }, { status: 404 })
					}

					const originUrl = new URL("/v1/shape", app.electricUrl)

					const clerkClient = createClerkClient({
						secretKey: app.clerkSecretKey,
						publishableKey: app.clerkPublishableKey,
					})

					const requestState = yield* Effect.tryPromise({
						try: () =>
							clerkClient.authenticateRequest(req.source as Request, {
								// jwtKey: process.env.CLERK_JWT_KEY,
								// authorizedParties: ["https://example.com"],
							}),
						catch: (e) =>
							HttpServerResponse.json(
								{
									error: "Clerk not setup",
								},
								{
									status: 500,
								},
							),
					})

					const auth = requestState.toAuth()

					if (!auth || !auth.userId) {
						return yield* HttpServerResponse.json(
							{
								error: "Clerk not setup",
							},
							{
								status: 401,
							},
						)
					}

					if (!app.publicTables.includes(table)) {
						originUrl.searchParams.set("where", `${app.tenantColumnKey} = '${auth.userId}'`)
					}

					url.searchParams.forEach((value, key) => {
						if (["live", "table", "handle", "offset", "cursor"].includes(key)) {
							originUrl.searchParams.set(key, value)
						}
					})

					const authHeader = Match.value(app.auth).pipe(
						Match.when({ type: "basic" }, (auth) => `Basic ${btoa(auth.credentials!)}`),
						Match.when({ type: "bearer" }, (auth) => `Bearer ${auth.credentials!}`),
						Match.orElse(() => ""),
					)

					const resp = yield* Effect.promise(() =>
						fetch(originUrl.toString(), {
							headers: {
								Authorization: authHeader,
							},
						}),
					)

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

					return yield* HttpServerResponse.raw(resp.body, {
						status: resp.status,
						statusText: resp.statusText,
						headers: resp.headers as any,
					})
				}).pipe(Effect.orDie),
			)
			.handle("v1/verifyUrl", ({ payload, headers }) =>
				Effect.gen(function* () {
					const client = yield* HttpClient.HttpClient

					return yield* HttpClientRequest.get("/v1/health").pipe(
						HttpClientRequest.prependUrl(payload.url),
						HttpClientRequest.setHeader("Authorization", headers.electric_auth),
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
						Effect.catchAll(() => Effect.succeed({ valid: false })),
					)
				}).pipe(Effect.orDie),
			)
	}),
).pipe(Layer.provide(AppRepo.Default), Layer.provide(FetchHttpClient.layer))
