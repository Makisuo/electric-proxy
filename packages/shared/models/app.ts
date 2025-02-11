import { HttpApiSchema } from "@effect/platform"
import { Model } from "@effect/sql"
import { Schema } from "effect"

import { JwtId } from "./jwt.js"
import { TenantId } from "./user.js"

export const AppId = Schema.String.pipe(Schema.brand("AppId"))
export type AppId = typeof AppId.Type

export const ElectricAuthCredentials = Schema.Struct({
	type: Schema.Literal("electric-cloud"),
	sourceId: Schema.String,
	sourceSecret: Schema.String,
})

export const BearerCredentials = Schema.Struct({
	type: Schema.Literal("bearer"),
	credentials: Schema.String,
})

export const BasicCredentials = Schema.Struct({
	type: Schema.Literal("basic"),
	username: Schema.String,
	password: Schema.String,
})

export const AuthSchema = Schema.Union(BearerCredentials, BasicCredentials, ElectricAuthCredentials)

export class App extends Model.Class<App>("App")({
	id: Model.GeneratedByApp(AppId),
	name: Schema.String.pipe(Schema.trimmed(), Schema.minLength(3)),
	clerkSecretKey: Schema.NullOr(Schema.String.pipe(Schema.trimmed())),
	electricUrl: Schema.String,
	publicTables: Model.JsonFromString(Schema.mutable(Schema.Array(Schema.String))),
	tenantColumnKey: Schema.String,

	auth: Model.JsonFromString(Schema.NullOr(AuthSchema)),

	jwtId: Model.GeneratedByApp(Schema.NullOr(JwtId)),

	tenantId: Model.GeneratedByApp(TenantId),
}) {}

export class AppNotFound extends Schema.TaggedError<AppNotFound>()(
	"AppNotFound",
	{
		id: AppId,
	},
	HttpApiSchema.annotations({ status: 404 }),
) {}
