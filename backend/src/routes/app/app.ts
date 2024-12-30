import { Effect, Option, pipe } from "effect"
import { nanoid } from "nanoid"
import { App, AppId, AppNotFound } from "~/models/app"
import type { TenantId } from "~/models/user"
import { policyRequire } from "~/policy"
import { AppRepo } from "~/repositories/app-repo"
import { SqlLive } from "~/services/sql"

export class AppHelper extends Effect.Service<AppHelper>()("App", {
	effect: Effect.gen(function* () {
		const appRepo = yield* AppRepo

		const create = (tenantId: TenantId, app: typeof App.jsonCreate.Type) =>
			pipe(
				appRepo.insert(
					App.insert.make({
						id: AppId.make(nanoid()),
						...app,
						tenantId,
					}),
				),
				Effect.withSpan("App.create", { attributes: { app, tenantId } }),
				policyRequire("App", "create"),
			)

		const findById = Effect.fn("App.findById")(function* (id: AppId) {
			return yield* pipe(
				appRepo.findById(id).pipe(
					Effect.flatMap(
						Option.match({
							onSome: Effect.succeed,
							onNone: () => new AppNotFound({ id: id }),
						}),
					),
				),
				policyRequire("App", "read"),
			)
		})

		const findMany = Effect.fn("App.findMany")(appRepo.findManyByTenantId)

		const deleteApp = Effect.fn("App.delete")((id: AppId) => {
			return appRepo.findById(id).pipe(
				Effect.flatMap(
					Option.match({
						onNone: () => new AppNotFound({ id }),
						onSome: Effect.succeed,
					}),
				),
				Effect.andThen(() => appRepo.delete(id)),
				// Disabled since we are using D1
				// sql.withTransaction,
				// Effect.catchTag("SqlError", (err) => Effect.die(err)),
				Effect.withSpan("Collection.delete", { attributes: { id } }),
				policyRequire("App", "delete"),
			)
		})

		const update = (app: App, update: Partial<typeof App.jsonUpdate.Type>) =>
			pipe(
				appRepo.update({
					...app,
					...update,
				}),
				Effect.withSpan("App.update", {
					attributes: { id: app.id, update },
				}),
				policyRequire("App", "update"),
			)

		const with_ = <A, E, R>(
			id: AppId,
			f: (app: App) => Effect.Effect<A, E, R>,
		): Effect.Effect<A, E | AppNotFound, R> =>
			pipe(
				appRepo.findById(id),
				Effect.flatMap(
					Option.match({
						onNone: () => new AppNotFound({ id }),
						onSome: Effect.succeed,
					}),
				),
				Effect.flatMap(f),
				// Disabled since we are using D1
				//sql.withTransaction,
				// Effect.catchTag("SqlError", (err) => Effect.die(err)),
				Effect.withSpan("App.with", { attributes: { id } }),
			)

		return {
			findById,
			delete: deleteApp,
			with: with_,
			update,
			create,
			findMany,
		} as const
	}),
	dependencies: [AppRepo.Default, SqlLive],
}) {}
