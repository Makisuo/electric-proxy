import { HttpApiBuilder } from "@effect/platform"
import { Effect, Layer } from "effect"
import { nanoid } from "nanoid"
import { Api } from "~/api"
import { App, AppId } from "~/models/app"
import { AppRepo } from "~/repositories/app-repo"

export const HttpAppRouteLive = HttpApiBuilder.group(Api, "App", (handlers) =>
	Effect.gen(function* () {
		const appRepo = yield* AppRepo
		return handlers.handle("createApp", ({ payload }) =>
			Effect.gen(function* () {
				const app = yield* appRepo.insert(App.insert.make({ ...payload, id: AppId.make(nanoid()) }))
				return app
			}),
		)
	}),
).pipe(Layer.provide(AppRepo.Default))
