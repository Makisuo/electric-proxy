import { HttpApiEndpoint, HttpApiGroup, HttpServerRequest, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { Authorization } from "~/authorization"

import { App, AppId, AppNotFound } from "~/models/app"

export class AppApi extends HttpApiGroup.make("App")
	.add(
		HttpApiEndpoint.post("createApp", "/api/app")
			.annotate(OpenApi.Summary, "Create a new app")
			.setPayload(App.jsonCreate)
			.addSuccess(App.json),
	)
	.add(HttpApiEndpoint.get("getApps", "/api/apps").addSuccess(Schema.Array(App.json)))
	.add(
		HttpApiEndpoint.get("getApp", "/api/app/:id")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.addSuccess(App.json)
			.addError(AppNotFound),
	)
	.add(
		HttpApiEndpoint.put("updateApp", "/api/app/:id")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.setPayload(App.jsonUpdate)
			.addSuccess(App.json),
	)
	.add(HttpApiEndpoint.del("deleteApp", "/api/app/:id").setPath(Schema.Struct({ id: AppId })))
	.middlewareEndpoints(Authorization) {}
