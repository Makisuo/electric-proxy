import { HttpApiBuilder } from "@effect/platform"
import { Effect, Layer, Option } from "effect"
import { nanoid } from "nanoid"
import { Api } from "~/api"
import { Authorization } from "~/authorization"
import { App, AppId, AppNotFound } from "~/models/app"
import { AppRepo } from "~/repositories/app-repo"

export const HttpAppRouteLive = HttpApiBuilder.group(Api, "App", (handlers) =>
	Effect.gen(function* () {
		const appRepo = yield* AppRepo
		return handlers
			.handle("createApp", ({ payload }) =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					const app = yield* appRepo.insert(
						App.insert.make({ ...payload, id: AppId.make(nanoid()), tenantId: currentUser.tenantId }),
					)
					return app
				}),
			)
			.handle("getApps", () =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					const apps = yield* appRepo.findManyByTenantId(currentUser.tenantId)
					return apps
				}),
			)
			.handle("getApp", ({ path }) =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					// TODO: Should first check if user owns the APP this is insecure lol
					const app = yield* appRepo.findById(path.id).pipe(
						Effect.flatMap(
							Option.match({
								onSome: Effect.succeed,
								onNone: () => new AppNotFound({ id: path.id }),
							}),
						),
					)

					return app
				}),
			)
			.handle("updateApp", ({ path, payload }) =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					// TODO: Should first check if user owns the APP this is insecure lol
					const app = yield* appRepo.update({ ...payload, id: path.id, tenantId: currentUser.tenantId })

					return app
				}),
			)
			.handle("deleteApp", ({ path }) =>
				Effect.gen(function* () {
					const currentUser = yield* Authorization.provides

					// TODO: Should first check if user owns the APP this is insecure lol
					yield* appRepo.delete(path.id)
				}),
			)
	}),
).pipe(Layer.provide(AppRepo.Default))
