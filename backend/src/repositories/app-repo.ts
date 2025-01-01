import { Effect } from "effect"

import { makeModelExtended } from "~/lib/model-extended"
import { SqlLive } from "~/services/sql"

import { App } from "shared/models/app"

const TABLE_NAME = "apps"
const SPAN_PREFIX = "AppRepo"

export class AppRepo extends Effect.Service<AppRepo>()("AppRepo", {
	effect: Effect.gen(function* () {
		const baseRepository = yield* makeModelExtended(App, {
			tableName: TABLE_NAME,
			spanPrefix: SPAN_PREFIX,
			idColumn: "id",
			tenantColumn: "tenant_id",
		})

		return { ...baseRepository }
	}),
	dependencies: [SqlLive],
}) {}
