import { Model } from "@effect/sql"
import { Schema } from "effect"
import { JWT_ALG, JWT_PUBLIC_KEY } from "~/services/jose"

export const JwtId = Schema.String.pipe(Schema.brand("JwtId"))
export type JwtId = typeof JwtId.Type

export class Jwt extends Model.Class<Jwt>("Jwt")({
	id: Model.GeneratedByApp(JwtId),

	publicKey: JWT_PUBLIC_KEY,
	alg: JWT_ALG,
}) {}
