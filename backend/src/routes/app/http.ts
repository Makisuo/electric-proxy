import { HttpApiBuilder } from "@effect/platform"
import { Effect, Layer, pipe } from "effect"
import { Api } from "~/api"
import { Authorization } from "~/authorization"
import { policyUse, withSystemActor } from "~/policy"
import { AppRepo } from "~/repositories/app-repo"
import { AppHelper } from "./app"
import { AppPolicy } from "./policy"

export const HttpAppRouteLive = HttpApiBuilder.group(Api, "App", (handlers) =>
	Effect.gen(function* () {
		const appHelper = yield* AppHelper
		const policy = yield* AppPolicy

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
	}),
).pipe(Layer.provide([AppRepo.Default, AppHelper.Default, AppPolicy.Default]))
