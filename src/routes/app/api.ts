import { HttpApiEndpoint, HttpApiGroup, HttpServerRequest, OpenApi } from "@effect/platform"
import { Authorization } from "~/authorization"

import { App } from "~/models/app"

export class AppApi extends HttpApiGroup.make("App")
	.add(
		HttpApiEndpoint.post("createApp", "/app")
			.annotate(OpenApi.Summary, "Create a new app")
			.setPayload(App.jsonCreate)
			.addSuccess(App.json),
	)
	.middlewareEndpoints(Authorization) {}
