import { Model } from "@effect/sql"
import { Schema } from "effect"

export const JwtId = Schema.String.pipe(Schema.brand("JwtId"))
export type JwtId = typeof JwtId.Type

export const JWT_ALG = Schema.Literal("RS256", "PS256", "RS256", "EdDSA")
export const JWT_PUBLIC_KEY = Schema.String.pipe(Schema.brand("JWT_PUBLIC_KEY"), Schema.trimmed())
export const JWT_REMOTE_PUBLIC_KEY = Schema.String.pipe(Schema.brand("JWT_REMOTE_PUBLIC_KEY"))

export class Jwt extends Model.Class<Jwt>("Jwt")({
	id: Model.GeneratedByApp(JwtId),

	publicKey: Schema.NullOr(JWT_PUBLIC_KEY),
	publicKeyRemote: Schema.NullOr(JWT_REMOTE_PUBLIC_KEY),
	alg: Schema.NullOr(JWT_ALG),
	provider: Schema.NullOr(Schema.Literal("clerk", "custom", "custom-remote")),
}) {}
