import { Model } from "@effect/sql"
import { Schema } from "effect"

export const AppId = Schema.String.pipe(Schema.brand("AppId"))
export type AppId = typeof AppId.Type

export class App extends Model.Class<App>("App")({
	id: Model.Generated(AppId),
	name: Schema.String,
	clerkSecretKey: Schema.String,
	clerkPublishableKey: Schema.String,
	electricUrl: Schema.String,
	publicTables: Model.JsonFromString(Schema.Array(Schema.String)),
	tenantColumnKey: Schema.String,
}) {}

export class AppNotFound extends Schema.TaggedError<AppNotFound>()("AppNotFound", {
	id: AppId,
}) {}
