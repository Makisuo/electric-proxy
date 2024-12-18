import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { AppId } from "~/models/app"

export class ElectricApi extends HttpApiGroup.make("Electric").add(
	HttpApiEndpoint.get("v1/shape", "/electric/:id/v1/shape").setPath(
		Schema.Struct({
			id: AppId,
		}),
	),
) {}
