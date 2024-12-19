import { HttpApiEndpoint, HttpApiGroup, HttpServerRequest, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { Authorization } from "~/authorization"

import { App } from "~/models/app"

export class AppApi extends HttpApiGroup.make("App")
	.add(
		HttpApiEndpoint.post("createApp", "/api/app")
			.annotate(OpenApi.Summary, "Create a new app")
			.setPayload(App.jsonCreate)
			.addSuccess(App.json),
	)
	.add(HttpApiEndpoint.get("getApps", "/api/apps").addSuccess(Schema.Array(App.json)))
	.middlewareEndpoints(Authorization) {}
