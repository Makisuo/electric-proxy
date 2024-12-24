import { HttpApi, HttpServerRequest, OpenApi } from "@effect/platform"
import { Effect, Layer } from "effect"
import { Authorization, User } from "./authorization"
import { Unauthorized } from "./errors"
import { TenantId } from "./models/user"
import { AppApi } from "./routes/app/api"
import { AuthApi } from "./routes/auth/api"
import { BetterAuthApi } from "./routes/better-auth/api"
import { ElectricApi } from "./routes/electric/api"
import { RootApi } from "./routes/root/api"
import { BetterAuth } from "./services/better-auth"

export const AuthorizationLive = Layer.effect(
	Authorization,
	Effect.gen(function* () {
		const betterAuth = yield* BetterAuth

		yield* Effect.log("creating Authorization middleware")

		return Authorization.of({
			bearer: (bearerToken) =>
				Effect.gen(function* () {
					const req = yield* HttpServerRequest.HttpServerRequest

					const raw = req.source as Request

					const session = yield* betterAuth
						.call((client) =>
							client.api.getSession({
								headers: new Headers(raw.headers),
							}),
						)
						.pipe(
							Effect.tapError((err) => Effect.logError(err)),
							Effect.catchTag(
								"BetterAuthApiError",
								(err) =>
									new Unauthorized({
										action: "read",
										actorId: TenantId.make("anonymous"),
										entity: "Unknown",
									}),
							),
						)

					console.log(session, "SESSION")

					if (!session) {
						return yield* Effect.fail(
							new Unauthorized({
								action: "read",
								actorId: TenantId.make("anonymous"),
								entity: "Unknown",
							}),
						)
					}

					const subId = session.session.userId

					return User.make({
						tenantId: TenantId.make(subId),
					})
				}),
		})
	}).pipe(Effect.provide(BetterAuth.Default)),
)

export class Api extends HttpApi.make("api")
	.add(RootApi)
	.add(ElectricApi)
	.add(AppApi)
	.add(AuthApi)
	.add(BetterAuthApi)
	.annotate(OpenApi.Title, "Electric Auth Proxy API") {}
