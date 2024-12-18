import { Effect } from "effect"

import { Model } from "@effect/sql"
import { App } from "~/models/app"
import { SqlLive } from "~/services/sql"

const TABLE_NAME = "apps"
const SPAN_PREFIX = "AppRepo"

export class AppRepo extends Effect.Service<AppRepo>()("AppRepo", {
	effect: Model.makeRepository(App, {
		tableName: TABLE_NAME,
		spanPrefix: SPAN_PREFIX,
		idColumn: "id",
	}),
	dependencies: [SqlLive],
}) {}
