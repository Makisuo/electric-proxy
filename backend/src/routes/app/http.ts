import { HttpApiBuilder } from "@effect/platform"
import { Config, Effect, Layer, pipe } from "effect"
import { Api } from "~/api"
import { Authorization } from "~/authorization"
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
			.handle("getAnalytics", ({ path }) =>
				Effect.gen(function* () {
					const data = yield* analytics.getUnique(path.id)

					return data.data
				}).pipe(Effect.orDie),
			)
	}),
).pipe(Layer.provide([AppRepo.Default, AppHelper.Default, AppPolicy.Default, Analytics.Default]))
