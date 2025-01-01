import { HttpApiBuilder } from "@effect/platform"
import { Config, Duration, Effect, Layer, Option, pipe } from "effect"
import { Api } from "~/api"
import { Authorization } from "~/authorization"
import { InvalidDuration } from "~/errors"
import { policyUse, withSystemActor } from "~/policy"
import { AppRepo } from "~/repositories/app-repo"
import { Analytics } from "~/services/analytics"
import { AppHelper } from "./app"
import { AppPolicy } from "./policy"

export const HttpAppRouteLive = HttpApiBuilder.group(Api, "App", (handlers) =>
	Effect.gen(function* () {
		const appHelper = yield* AppHelper
		const policy = yield* AppPolicy
		const analytics = yield* Analytics

		return handlers
			.handle("createApp", ({ payload }) =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					return yield* appHelper.create(currentUser.tenantId, payload).pipe(withSystemActor)
				}),
			)
			.handle("upsertJwt", ({ path, payload }) =>
				Effect.gen(function* () {
					return yield* appHelper.updateJwt(path.id, payload).pipe(withSystemActor)
				}).pipe(Effect.orDie),
			)
			.handle("getApps", () =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					return yield* appHelper.findMany(currentUser.tenantId)
				}),
			)
			.handle("getApp", ({ path }) => appHelper.findById(path.id).pipe(policyUse(policy.canRead(path.id))))
			.handle("updateApp", ({ path, payload }) =>
				appHelper.with(path.id, (app) =>
					pipe(appHelper.update(app, payload), policyUse(policy.canUpdate(app))),
				),
			)
			.handle("deleteApp", ({ path }) => pipe(appHelper.delete(path.id), policyUse(policy.canDelete(path.id))))
			.handle("getAnalytics", ({ path, urlParams }) =>
				Effect.gen(function* () {
					const duration = yield* Duration.decodeUnknown(urlParams.duration ?? "24 hours").pipe(
						Option.match({
							onNone: () => Effect.fail(new InvalidDuration({ message: "Invalid duration" })),
							onSome: Effect.succeed,
						}),
					)
					const data = yield* analytics.getUnique(path.id, duration)

					return data.data
				}).pipe(Effect.orDie),
			)
	}),
).pipe(Layer.provide([AppRepo.Default, AppHelper.Default, AppPolicy.Default, Analytics.Default]))
