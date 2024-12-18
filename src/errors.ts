import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
	"Unauthorized",
	{
		message: Schema.String,
	},
	HttpApiSchema.annotations({ status: 401 }),
) {}
