import { HttpApiBuilder } from "@effect/platform"
import { Effect, Layer } from "effect"
import { nanoid } from "nanoid"
import { Api } from "~/api"
import { Authorization } from "~/authorization"
import { App, AppId } from "~/models/app"
import { AppRepo } from "~/repositories/app-repo"

export const HttpAppRouteLive = HttpApiBuilder.group(Api, "App", (handlers) =>
	Effect.gen(function* () {
		const appRepo = yield* AppRepo
		return handlers.handle("createApp", ({ payload }) =>
			Effect.gen(function* () {
				const currentUser = yield* Authorization.provides

				const app = yield* appRepo.insert(
					App.insert.make({ ...payload, id: AppId.make(nanoid()), tenantId: currentUser.tenantId }),
				)
				return app
			}),
		)
	}),
).pipe(Layer.provide(AppRepo.Default))
