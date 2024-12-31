import { Model } from "@effect/sql"
import { Schema } from "effect"
import { JWT_ALG, JWT_PUBLIC_KEY, JWT_REMOTE_PUBLIC_KEY } from "~/services/jose"

export const JwtId = Schema.String.pipe(Schema.brand("JwtId"))
export type JwtId = typeof JwtId.Type

export class Jwt extends Model.Class<Jwt>("Jwt")({
	id: Model.GeneratedByApp(JwtId),

	publicKey: Schema.NullOr(JWT_PUBLIC_KEY),
	publicKeyRemote: Schema.NullOr(JWT_REMOTE_PUBLIC_KEY),
	alg: Schema.NullOr(JWT_ALG),
	provider: Schema.NullOr(Schema.Literal("clerk", "custom", "custom-remote")),
}) {}
