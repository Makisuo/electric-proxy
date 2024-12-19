import { createClerkClient } from "@clerk/backend"
import { HttpApiBuilder, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Config, Effect, Layer, Option } from "effect"
import { Api } from "~/api"
import { Unauthorized } from "~/errors"
import { AppNotFound } from "~/models/app"
import { AppRepo } from "~/repositories/app-repo"

const publicTable = ["institutions", "companies", "categories"]

export const HttpElectricLive = HttpApiBuilder.group(Api, "Electric", (handlers) =>
	Effect.gen(function* () {
		return handlers.handleRaw("v1/shape", ({ path }) =>
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
					catch: (e) => new Unauthorized({ message: "Clerk doesnt seem to be setup" }),
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

				const resp = yield* Effect.promise(() => fetch(originUrl.toString()))

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
	}),
).pipe(Layer.provide(AppRepo.Default))
