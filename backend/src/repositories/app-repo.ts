import { Effect } from "effect"

import { Model } from "@effect/sql"
import { makeModelExtended } from "~/lib/model-extended"
import { App } from "~/models/app"
import { SqlLive } from "~/services/sql"

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
