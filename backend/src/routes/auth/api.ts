import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

export class AuthApi extends HttpApiGroup.make("Auth").add(
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
) {}
