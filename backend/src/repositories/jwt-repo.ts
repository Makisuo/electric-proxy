import { Model } from "@effect/sql"
import { Effect } from "effect"

import { Jwt } from "~/models/jwt"
import { SqlLive } from "~/services/sql"

const TABLE_NAME = "jwts"
const SPAN_PREFIX = "JwtRepo"

export class JwtRepo extends Effect.Service<JwtRepo>()(SPAN_PREFIX, {
	effect: Effect.gen(function* () {
		const base = yield* Model.makeRepository(Jwt, {
			tableName: TABLE_NAME,
			spanPrefix: SPAN_PREFIX,
			idColumn: "id",
		})

		return { ...base }
	}),
	dependencies: [SqlLive],
}) {}
