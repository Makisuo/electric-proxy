import { HttpApiSchema } from "@effect/platform"
import { Model } from "@effect/sql"
import { Schema } from "effect"
import { JWT_ALG, JWT_PUBLIC_KEY } from "~/services/jose"
import { TenantId } from "./user"

export const AppId = Schema.String.pipe(Schema.brand("AppId"))
export type AppId = typeof AppId.Type

export const AuthSchema = Schema.Struct({
	type: Schema.NullOr(Schema.Literal("bearer", "basic")),
	credentials: Schema.NullOr(Schema.String),
})

export const JWTSchema = Schema.Struct({
	publicKey: Schema.NullOr(JWT_PUBLIC_KEY),
	alg: Schema.NullOr(JWT_ALG),
})

export class App extends Model.Class<App>("App")({
	id: Model.GeneratedByApp(AppId),
	name: Schema.String,
	clerkSecretKey: Schema.String,
	clerkPublishableKey: Schema.String,
	electricUrl: Schema.String,
	publicTables: Model.JsonFromString(Schema.Array(Schema.String)),
	tenantColumnKey: Schema.String,

	// jwt: Model.JsonFromString(JWTSchema),
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
