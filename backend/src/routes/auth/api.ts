import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { JWT, JWT_ALG, JWT_PUBLIC_KEY, JoseError } from "~/services/jose"

export class AuthApi extends HttpApiGroup.make("Auth")
	.add(
		HttpApiEndpoint.post("verifyAuthToken", "/auth/verify-token")
			.setPayload(
				Schema.Struct({
					type: Schema.Literal("clerk"),
					credentials: Schema.String,
				}),
			)
			.addSuccess(
				Schema.Struct({
					valid: Schema.Boolean,
					id: Schema.NullOr(Schema.String),
					environmentType: Schema.NullOr(Schema.String),
				}),
			),
	)
	.add(
		HttpApiEndpoint.post("verifyJwt", "/auth/verify-jwt")
			.setPayload(
				Schema.Struct({
					alg: JWT_ALG,
					jwtPublicKey: JWT_PUBLIC_KEY,
					jwt: JWT,
				}),
			)
			.addSuccess(
				Schema.Struct({
					tenantId: Schema.NullOr(Schema.String),
				}),
			)
			.addError(JoseError),
	) {}
