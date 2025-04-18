import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

import { AppId, AuthSchema } from "shared/models/app"

export class ElectricApi extends HttpApiGroup.make("Electric")
	.add(
		HttpApiEndpoint.get("v1/shape", "/electric/:id/v1/shape").setPath(
			Schema.Struct({
				id: AppId,
			}),
		),
	)
	.add(
		HttpApiEndpoint.post("v1/verifyUrl", "/electric/v1/verify-url")
			.setPayload(
				Schema.Struct({
					url: Schema.String,
					auth: AuthSchema,
				}),
			)
			.addSuccess(Schema.Struct({ valid: Schema.Boolean })),
	) {}
