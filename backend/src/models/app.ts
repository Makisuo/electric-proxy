import { HttpApiSchema } from "@effect/platform"
import { Model } from "@effect/sql"
import { Schema } from "effect"
import { TenantId } from "~/authorization"

export const AppId = Schema.String.pipe(Schema.brand("AppId"))
export type AppId = typeof AppId.Type

export const AuthSchema = Schema.Struct({
	type: Schema.NullOr(Schema.Literal("bearer", "basic")),
	credentials: Schema.NullOr(Schema.String),
})

export class App extends Model.Class<App>("App")({
	id: Model.GeneratedByApp(AppId),
	name: Schema.String,
	clerkSecretKey: Schema.String,
	clerkPublishableKey: Schema.String,
	electricUrl: Schema.String,
	publicTables: Model.JsonFromString(Schema.Array(Schema.String)),
	tenantColumnKey: Schema.String,

	auth: Model.JsonFromString(AuthSchema),

	tenantId: Model.GeneratedByApp(TenantId),
}) {}

export class AppNotFound extends Schema.TaggedError<AppNotFound>()(
	"AppNotFound",
	{
		id: AppId,
	},
	HttpApiSchema.annotations({ status: 404 }),
) {}
