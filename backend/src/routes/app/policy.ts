import { Effect } from "effect"
import { Unauthorized } from "~/errors"
import { policy } from "~/policy"
import { AppHelper } from "./app"

import type { App, AppId } from "shared/models/app"

export class AppPolicy extends Effect.Service<AppPolicy>()("App/Policy", {
	effect: Effect.gen(function* () {
		const app = yield* AppHelper

		const canUpdate = (app: App) =>
			policy("App", "update", (actor) => Effect.succeed(actor.tenantId === app.tenantId))

		const canRead = (id: AppId) =>
			Unauthorized.refail(
				"App",
				"read",
			)(app.with(id, (app) => policy("App", "read", (actor) => Effect.succeed(actor.tenantId === app.tenantId))))

		const canDelete = (id: AppId) =>
			Unauthorized.refail(
				"App",
				"delete",
			)(
				app.with(id, (app) =>
					policy("App", "delete", (actor) => Effect.succeed(actor.tenantId === app.tenantId)),
				),
			)

		return { canUpdate, canRead, canDelete } as const
	}),
	dependencies: [AppHelper.Default],
}) {}
