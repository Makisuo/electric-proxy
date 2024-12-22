import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Effect } from "effect"
import { TenantId } from "~/models/user"

import type { Any } from "@effect/sql/Model"

export const makeModelExtended = <
	S extends Any,
	Id extends keyof S["Type"] & keyof S["update"]["Type"] & keyof S["fields"],
>(
	model: S,
	options: {
		readonly tableName: string
		readonly spanPrefix: string
		readonly idColumn: Id
		readonly tenantColumn: string
	},
) =>
	Effect.gen(function* () {
		const sql = yield* SqlClient.SqlClient

		const base = yield* Model.makeRepository(model, options)

		const findManyByTenantIdSchema = SqlSchema.findAll({
			Request: TenantId,
			Result: model,
			execute: (request) =>
				sql`SELECT * FROM ${sql(options.tableName)} WHERE ${sql(options.tenantColumn)} = ${request}`,
		})

		const findManyByTenantId = (
			tenantId: TenantId,
		): Effect.Effect<Array<S["Type"]>, never, S["Context"] | S["update"]["Context"]> =>
			findManyByTenantIdSchema(tenantId).pipe(
				Effect.orDie,
				Effect.withSpan(`${options.spanPrefix}.findManyByTenantId`, {
					captureStackTrace: false,
					attributes: { tenantId },
				}),
			) as any

		return { findManyByTenantId, ...base }
	})
